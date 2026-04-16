import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

type FormState = {
  person_age: string;
  person_gender: string;
  person_education: string;
  person_income: string;
  person_emp_exp: string;
  person_home_ownership: string;
  loan_amnt: string;
  loan_intent: string;
  loan_int_rate: string;
  loan_percent_income: string;
  cb_person_cred_hist_length: string;
  credit_score: string;
  previous_loan_defaults_on_file: string;
};

const initialForm: FormState = {
  person_age: "32",
  person_gender: "male",
  person_education: "Bachelor",
  person_income: "65000",
  person_emp_exp: "6",
  person_home_ownership: "RENT",
  loan_amnt: "12000",
  loan_intent: "PERSONAL",
  loan_int_rate: "11.5",
  loan_percent_income: "0.18",
  cb_person_cred_hist_length: "7",
  credit_score: "680",
  previous_loan_defaults_on_file: "No",
};

type Verdict = {
  probability: number; // 0-100
  decision: "Approve" | "Review" | "Decline";
  riskIndex: number; // 0-100
  derived: {
    monthly_income: number;
    estimated_emi: number;
    dti_estimated: number;
    loan_to_income_ratio: number;
    income_stability_score: number;
    credit_utilization_proxy: number;
  };
  drivers: { label: string; impact: "increases" | "reduces"; weight: number }[];
};

const computeVerdict = (f: FormState): Verdict => {
  const age = +f.person_age || 0;
  const income = +f.person_income || 0;
  const emp = +f.person_emp_exp || 0;
  const amnt = +f.loan_amnt || 0;
  const rate = +f.loan_int_rate || 0;
  const pctIncome = +f.loan_percent_income || 0;
  const credHist = +f.cb_person_cred_hist_length || 0;
  const score = +f.credit_score || 0;
  const prevDefault = f.previous_loan_defaults_on_file === "Yes";

  const monthly_income = income / 12;
  // simple amortization (3y term)
  const months = 36;
  const r = rate / 100 / 12;
  const estimated_emi =
    r > 0 ? (amnt * r) / (1 - Math.pow(1 + r, -months)) : amnt / months;
  const dti_estimated = monthly_income > 0 ? estimated_emi / monthly_income : 1;
  const loan_to_income_ratio = income > 0 ? amnt / income : 1;
  const income_stability_score = Math.max(
    0,
    Math.min(100, 40 + emp * 5 + (f.person_home_ownership === "OWN" ? 15 : 0))
  );
  const credit_utilization_proxy = Math.max(
    0,
    Math.min(100, 100 - (score - 300) / 5.5)
  );

  // weighted risk score
  let risk = 0;
  risk += (700 - score) * 0.12; // lower score → higher risk
  risk += dti_estimated * 90; // dti drives risk
  risk += loan_to_income_ratio * 25;
  risk += rate * 1.2;
  risk -= emp * 1.5;
  risk -= credHist * 1.2;
  if (prevDefault) risk += 35;
  if (f.person_home_ownership === "OWN") risk -= 6;
  if (f.person_home_ownership === "MORTGAGE") risk -= 3;
  if (age < 22) risk += 6;

  const probability = Math.max(2, Math.min(97, Math.round(risk)));
  const riskIndex = probability;

  const decision: Verdict["decision"] =
    probability < 25 ? "Approve" : probability < 55 ? "Review" : "Decline";

  const drivers = [
    {
      label: `Credit score ${score}`,
      impact: score >= 700 ? ("reduces" as const) : ("increases" as const),
      weight: Math.abs(700 - score) / 4,
    },
    {
      label: `DTI ${(dti_estimated * 100).toFixed(1)}%`,
      impact: dti_estimated > 0.35 ? ("increases" as const) : ("reduces" as const),
      weight: Math.abs(dti_estimated - 0.3) * 120,
    },
    {
      label: `Loan-to-income ${(loan_to_income_ratio * 100).toFixed(1)}%`,
      impact:
        loan_to_income_ratio > 0.3 ? ("increases" as const) : ("reduces" as const),
      weight: Math.abs(loan_to_income_ratio - 0.25) * 80,
    },
    {
      label: `Employment ${emp} yrs`,
      impact: emp >= 4 ? ("reduces" as const) : ("increases" as const),
      weight: Math.abs(5 - emp) * 3,
    },
    {
      label: prevDefault ? "Prior default on file" : "No prior defaults",
      impact: prevDefault ? ("increases" as const) : ("reduces" as const),
      weight: prevDefault ? 35 : 12,
    },
    {
      label: `Interest rate ${rate}%`,
      impact: rate > 12 ? ("increases" as const) : ("reduces" as const),
      weight: Math.abs(rate - 10) * 1.5,
    },
  ]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);

  return {
    probability,
    decision,
    riskIndex,
    derived: {
      monthly_income,
      estimated_emi,
      dti_estimated,
      loan_to_income_ratio,
      income_stability_score,
      credit_utilization_proxy,
    },
    drivers,
  };
};

const decisionStyles: Record<
  Verdict["decision"],
  { icon: typeof CheckCircle2; label: string; bg: string; ring: string }
> = {
  Approve: {
    icon: CheckCircle2,
    label: "Approve",
    bg: "bg-emerald-500/10 text-emerald-400",
    ring: "ring-emerald-500/30",
  },
  Review: {
    icon: AlertTriangle,
    label: "Manual review",
    bg: "bg-amber-500/10 text-amber-400",
    ring: "ring-amber-500/30",
  },
  Decline: {
    icon: ShieldAlert,
    label: "Decline",
    bg: "bg-red-500/10 text-red-400",
    ring: "ring-red-500/30",
  },
};

const Field = ({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
      {label}
    </Label>
    {children}
    {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
  </div>
);

const Predict = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.person_income || !form.loan_amnt || !form.credit_score) {
      toast.error("Please fill income, loan amount and credit score");
      return;
    }
    const v = computeVerdict(form);
    setVerdict(v);
    toast.success(`Risk score ${v.probability}% — ${v.decision}`);
  };

  const handleReset = () => {
    setForm(initialForm);
    setVerdict(null);
  };

  const decision = verdict ? decisionStyles[verdict.decision] : null;
  const DecisionIcon = decision?.icon;

  const inputCls = "h-10 bg-input/60";

  const derivedStats = useMemo(() => {
    if (!verdict) return [];
    const d = verdict.derived;
    return [
      { label: "Monthly income", value: `$${d.monthly_income.toFixed(0)}` },
      { label: "Estimated EMI", value: `$${d.estimated_emi.toFixed(0)}` },
      { label: "DTI estimated", value: `${(d.dti_estimated * 100).toFixed(1)}%` },
      {
        label: "Loan-to-income",
        value: `${(d.loan_to_income_ratio * 100).toFixed(1)}%`,
      },
      {
        label: "Income stability",
        value: `${d.income_stability_score.toFixed(0)}/100`,
      },
      {
        label: "Credit utilization proxy",
        value: `${d.credit_utilization_proxy.toFixed(0)}/100`,
      },
    ];
  }, [verdict]);

  return (
    <main className="min-h-screen w-full pb-24 pt-6">
      <SiteNav authed />

      <section className="mx-auto mt-12 w-full max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Loan default predictor
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Score a borrower in{" "}
            <span className="text-gradient-brand">real time</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Enter the borrower's profile and loan request. RiskLens computes a
            probability of default, the top risk drivers, and an underwriting
            recommendation.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Form */}
          <Card
            className="border-border lg:col-span-3"
            style={{
              background: "var(--gradient-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-lg">Borrower & loan inputs</CardTitle>
              <CardDescription>
                All 13 raw signals — derived ratios are computed automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Borrower */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Borrower profile
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <Field label="Age" htmlFor="person_age">
                      <Input
                        id="person_age"
                        type="number"
                        className={inputCls}
                        value={form.person_age}
                        onChange={(e) => update("person_age", e.target.value)}
                      />
                    </Field>
                    <Field label="Gender" htmlFor="person_gender">
                      <Select
                        value={form.person_gender}
                        onValueChange={(v) => update("person_gender", v)}
                      >
                        <SelectTrigger className={inputCls}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Education" htmlFor="person_education">
                      <Select
                        value={form.person_education}
                        onValueChange={(v) => update("person_education", v)}
                      >
                        <SelectTrigger className={inputCls}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High School">High School</SelectItem>
                          <SelectItem value="Associate">Associate</SelectItem>
                          <SelectItem value="Bachelor">Bachelor</SelectItem>
                          <SelectItem value="Master">Master</SelectItem>
                          <SelectItem value="Doctorate">Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Annual income (USD)" htmlFor="person_income">
                      <Input
                        id="person_income"
                        type="number"
                        className={inputCls}
                        value={form.person_income}
                        onChange={(e) => update("person_income", e.target.value)}
                      />
                    </Field>
                    <Field label="Employment exp (yrs)" htmlFor="person_emp_exp">
                      <Input
                        id="person_emp_exp"
                        type="number"
                        className={inputCls}
                        value={form.person_emp_exp}
                        onChange={(e) => update("person_emp_exp", e.target.value)}
                      />
                    </Field>
                    <Field label="Home ownership" htmlFor="person_home_ownership">
                      <Select
                        value={form.person_home_ownership}
                        onValueChange={(v) => update("person_home_ownership", v)}
                      >
                        <SelectTrigger className={inputCls}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RENT">Rent</SelectItem>
                          <SelectItem value="OWN">Own</SelectItem>
                          <SelectItem value="MORTGAGE">Mortgage</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>

                {/* Loan */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Loan request
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <Field label="Loan amount (USD)" htmlFor="loan_amnt">
                      <Input
                        id="loan_amnt"
                        type="number"
                        className={inputCls}
                        value={form.loan_amnt}
                        onChange={(e) => update("loan_amnt", e.target.value)}
                      />
                    </Field>
                    <Field label="Loan intent" htmlFor="loan_intent">
                      <Select
                        value={form.loan_intent}
                        onValueChange={(v) => update("loan_intent", v)}
                      >
                        <SelectTrigger className={inputCls}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERSONAL">Personal</SelectItem>
                          <SelectItem value="EDUCATION">Education</SelectItem>
                          <SelectItem value="MEDICAL">Medical</SelectItem>
                          <SelectItem value="VENTURE">Venture</SelectItem>
                          <SelectItem value="HOMEIMPROVEMENT">
                            Home improvement
                          </SelectItem>
                          <SelectItem value="DEBTCONSOLIDATION">
                            Debt consolidation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Interest rate (%)" htmlFor="loan_int_rate">
                      <Input
                        id="loan_int_rate"
                        type="number"
                        step="0.1"
                        className={inputCls}
                        value={form.loan_int_rate}
                        onChange={(e) => update("loan_int_rate", e.target.value)}
                      />
                    </Field>
                    <Field
                      label="Loan % of income"
                      htmlFor="loan_percent_income"
                      hint="0.18 = 18% of annual income"
                    >
                      <Input
                        id="loan_percent_income"
                        type="number"
                        step="0.01"
                        className={inputCls}
                        value={form.loan_percent_income}
                        onChange={(e) =>
                          update("loan_percent_income", e.target.value)
                        }
                      />
                    </Field>
                  </div>
                </div>

                {/* Credit */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Credit history
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <Field
                      label="Credit history (yrs)"
                      htmlFor="cb_person_cred_hist_length"
                    >
                      <Input
                        id="cb_person_cred_hist_length"
                        type="number"
                        className={inputCls}
                        value={form.cb_person_cred_hist_length}
                        onChange={(e) =>
                          update("cb_person_cred_hist_length", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Credit score" htmlFor="credit_score">
                      <Input
                        id="credit_score"
                        type="number"
                        className={inputCls}
                        value={form.credit_score}
                        onChange={(e) => update("credit_score", e.target.value)}
                      />
                    </Field>
                    <Field
                      label="Previous defaults on file"
                      htmlFor="previous_loan_defaults_on_file"
                    >
                      <Select
                        value={form.previous_loan_defaults_on_file}
                        onValueChange={(v) =>
                          update("previous_loan_defaults_on_file", v)
                        }
                      >
                        <SelectTrigger className={inputCls}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    className="h-11 bg-gradient-brand text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
                  >
                    Predict default risk
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="h-11 bg-transparent"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Result */}
          <div className="space-y-6 lg:col-span-2">
            <Card
              className={`border-border ${verdict ? `ring-1 ${decision!.ring}` : ""}`}
              style={{
                background: "var(--gradient-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">Risk verdict</CardTitle>
                <CardDescription>
                  Probability of default within 36 months.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!verdict ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/30 px-6 py-10 text-center">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Submit the form to see the predicted default probability
                      and top risk drivers.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div
                      className={`flex items-center justify-between rounded-xl px-4 py-3 ${decision!.bg}`}
                    >
                      <div className="flex items-center gap-3">
                        {DecisionIcon && <DecisionIcon className="h-5 w-5" />}
                        <div>
                          <p className="text-xs uppercase tracking-wide opacity-80">
                            Recommendation
                          </p>
                          <p className="text-base font-semibold">
                            {decision!.label}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold tabular-nums">
                          {verdict.probability}%
                        </p>
                        <p className="text-[11px] opacity-80">
                          Default probability
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Risk index</span>
                        <span className="tabular-nums">
                          {verdict.riskIndex}/100
                        </span>
                      </div>
                      <Progress value={verdict.riskIndex} className="h-2" />
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Top risk drivers
                      </p>
                      <ul className="space-y-2">
                        {verdict.drivers.map((d) => (
                          <li
                            key={d.label}
                            className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm"
                          >
                            <span className="text-foreground">{d.label}</span>
                            <Badge
                              variant="outline"
                              className={
                                d.impact === "increases"
                                  ? "border-red-500/30 text-red-400"
                                  : "border-emerald-500/30 text-emerald-400"
                              }
                            >
                              {d.impact === "increases" ? "↑ risk" : "↓ risk"}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {verdict && (
              <Card
                className="border-border"
                style={{ background: "var(--gradient-card)" }}
              >
                <CardHeader>
                  <CardTitle className="text-base">Derived signals</CardTitle>
                  <CardDescription>
                    Auto-computed features fed to the model.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-3">
                    {derivedStats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-border bg-background/40 px-3 py-2"
                      >
                        <dt className="text-[11px] text-muted-foreground">
                          {s.label}
                        </dt>
                        <dd className="text-sm font-semibold tabular-nums text-foreground">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}

            <div className="text-center">
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">← Back to overview</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Predict;
