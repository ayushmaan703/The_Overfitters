import { useState } from "react";
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
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { predictApi } from "@/store/slice/userSlice";

type FormState = {
  loan_amnt: string;
  loan_int_rate: string;
  loan_term: string;
  loan_intent: string;
  person_home_ownership: string;
  cb_person_default_on_file: string;
};

const initialForm: FormState = {
  person_home_ownership: "RENT",
  loan_amnt: "12000",
  loan_intent: "PERSONAL",
  loan_term: "36",
  loan_int_rate: "11.5",
  cb_person_default_on_file: "No",
};

// Clean up feature names for display
const formatFeatureName = (raw: string): string => {
  return raw
    .replace(/^(num__|cat__)/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const decisionStyles: Record<string, any> = {
  Approve: {
    icon: CheckCircle2,
    label: "Approve",
    bg: "bg-emerald-500/10 text-emerald-400",
    ring: "ring-emerald-500/30",
  },
  Review: {
    icon: AlertTriangle,
    label: "Manual Review",
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
    <Label
      htmlFor={htmlFor}
      className="text-xs font-medium text-muted-foreground"
    >
      {label}
    </Label>
    {children}
    {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
  </div>
);

const Predict = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState<FormState>(initialForm);
  const [verdict, setVerdict] = useState<any>(null);

  const userData = useSelector((state: any) => state.user.userData);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const dbCall = async (form: FormState) => {
    // const data = {
    //   ...form,
    //   person_age: userData.age,
    //   person_income: userData.income,
    //   person_emp_exp: userData.empExp,
    //   credit_score: userData.creditScore,
    // };
    const data = {
      loan_amnt: Number(form.loan_amnt),
      loan_int_rate: Number(form.loan_int_rate),
      loan_term: Number(form.loan_term),
      loan_intent: form.loan_intent,
      person_home_ownership: form.person_home_ownership,
      cb_person_default_on_file: form.cb_person_default_on_file,

      person_income: Number(userData.income),
      person_age: Number(userData.age),
      person_emp_exp: Number(userData.empExp),
      credit_score: Number(userData.creditScore),
    };
    const res = await dispatch(predictApi(data));
    console.log(res);

    if (res.type === "predictApi/fulfilled") {
      return res.payload;
    } else {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.loan_amnt) {
      toast.error("Please fill loan amount");
      return;
    }

    const d = await dbCall(form);
    if (d) {
      setVerdict(d);
      const grade = d.loan_grade ?? "?";
    } else {
      toast.error("Prediction failed. Please try again.");
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setVerdict(null);
  };

  let decision;
  if (verdict?.risk_score <= 0.35) decision = decisionStyles.Approve;
  if (verdict?.risk_score > 0.35 && verdict?.risk_score <= 0.6)
    decision = decisionStyles.Review;
  if (verdict?.risk_score > 0.6) decision = decisionStyles.Decline;
  const DecisionIcon = decision?.icon;

  // risk_score is 0–1, convert to 0–100 for display
  const riskPercent = verdict ? Math.round(verdict.risk_score * 100) : null;

  const inputCls = "h-10 bg-input/60";
  console.log(verdict?.recommendations?.recommendations?.length);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background pb-24 pt-6">
      {/* Background Interactive Model */}
      <div className="absolute inset-0 z-0 pointer-events-auto flex items-center justify-center opacity-80">
        <iframe
          src="https://my.spline.design/statisticscolumns-065ljrxxuAupAM9CDcqyf2sC/"
          frameBorder="0"
          width="100%"
          height="100%"
          title="Interactive 3D Background"
        ></iframe>
        <div className="pointer-events-none absolute inset-0 bg-background/40" />
      </div>

      <div className="relative z-10 pointer-events-none flex flex-col items-center">
        <div className="pointer-events-auto w-full">
          <SiteNav authed />
        </div>

        <section className="pointer-events-auto mx-auto mt-12 w-full max-w-6xl px-6">
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
              Enter the borrower's profile and loan request. Credit Wise AI computes a
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
                  All raw signals - derived ratios are computed automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Borrower */}
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Borrower Profile
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <Field
                        label="Home ownership"
                        htmlFor="person_home_ownership"
                      >
                        <Select
                          value={form.person_home_ownership}
                          onValueChange={(v) =>
                            update("person_home_ownership", v)
                          }
                        >
                          <SelectTrigger className="h-11 bg-input/50 border-border/60 focus:ring-2 focus:ring-brand/40">
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
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Loan Request
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <Field label="Loan amount" htmlFor="loan_amnt">
                        <Input
                          id="loan_amnt"
                          type="number"
                          className="h-11 bg-input/50 border-border/60 focus:ring-2 focus:ring-brand/40"
                          value={form.loan_amnt}
                          onChange={(e) => update("loan_amnt", e.target.value)}
                        />
                      </Field>

                      <Field label="Loan intent" htmlFor="loan_intent">
                        <Select
                          value={form.loan_intent}
                          onValueChange={(v) => update("loan_intent", v)}
                        >
                          <SelectTrigger className="h-11 bg-input/50 border-border/60 focus:ring-2 focus:ring-brand/40">
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
                          className="h-11 bg-input/50 border-border/60 focus:ring-2 focus:ring-brand/40"
                          value={form.loan_int_rate}
                          onChange={(e) =>
                            update("loan_int_rate", e.target.value)
                          }
                        />
                      </Field>

                      <Field
                        label="Loan Tenure (months)"
                        htmlFor="loan_term"
                        hint="Duration of the loan in months"
                      >
                        <Input
                          id="loan_term"
                          type="number"
                          step="0.01"
                          className="h-11 bg-input/50 border-border/60 focus:ring-2 focus:ring-brand/40"
                          value={form.loan_term}
                          onChange={(e) => update("loan_term", e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Credit */}
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-5">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Credit History
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <Field
                        label="Previous defaults on file"
                        htmlFor="cb_person_default_on_file"
                      >
                        <Select
                          value={form.cb_person_default_on_file}
                          onValueChange={(v) =>
                            update("cb_person_default_on_file", v)
                          }
                        >
                          <SelectTrigger className="h-11 bg-input/50 border-border/60 focus:ring-2 focus:ring-brand/40">
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

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      type="submit"
                      className="h-12 px-6 text-base bg-gradient-brand text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
                    >
                      Predict Risk
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleReset}
                      className="h-11 text-muted-foreground hover:text-foreground"
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
                className={`border-border ${verdict ? `ring-1 ${decision?.ring}` : ""}`}
                style={{
                  background: "var(--gradient-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Risk verdict</CardTitle>
                  <CardDescription>
                    Probability of default · Grade · Top risk drivers.
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
                      {/* Decision banner */}
                      <div
                        className={`flex items-center justify-between rounded-xl px-4 py-3 ${decision?.bg}`}
                      >
                        <div className="flex items-center gap-3">
                          {DecisionIcon && <DecisionIcon className="h-5 w-5" />}
                          <div>
                            <p className="text-xs uppercase tracking-wide opacity-80">
                              Recommendation
                            </p>
                            <p className="text-base font-semibold">
                              {decision?.label ?? verdict.loan_grade}
                            </p>
                            {/* <p className="text-xs opacity-70">
                            Grade {verdict.loan_grade} · {verdict.category}
                          </p> */}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold tabular-nums">
                            {riskPercent}%
                          </p>
                          <p className="text-[11px] opacity-80">
                            Default probability
                          </p>
                        </div>
                      </div>

                      {/* Risk bar */}
                      <div>
                        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Risk index</span>
                          <span className="tabular-nums">{riskPercent}/100</span>
                        </div>
                        <Progress value={riskPercent} className="h-2" />
                      </div>

                      {/* Top risk factors */}
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Top risk drivers
                        </p>
                        <ul className="space-y-2">
                          {verdict.top_risk_factors.map(
                            (d: {
                              feature: string;
                              shap_value: number;
                              direction: string;
                            }) => {
                              const increases = d.direction === "increases risk";
                              return (
                                <li
                                  key={d.feature}
                                  className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm"
                                >
                                  <span className="text-foreground">
                                    {formatFeatureName(d.feature)}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      increases
                                        ? "border-red-500/30 text-red-400"
                                        : "border-emerald-500/30 text-emerald-400"
                                    }
                                  >
                                    {increases ? "↑ risk" : "↓ risk"}
                                  </Badge>
                                </li>
                              );
                            },
                          )}
                        </ul>
                      </div>

                      {/* Recommendations */}
                      {(verdict.recommendations?.recommendations?.length > 0 ||
                        verdict.recommendations?.message) && (
                          <div>
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                              Recommendations
                            </p>

                            <div className="space-y-4">
                              {verdict.recommendations?.recommendations?.length > 0 ? (
                                verdict.recommendations.recommendations.map(
                                  (
                                    rec: {
                                      type: string;
                                      new_loan: number;
                                      pct_kept: number;
                                      risk: number;
                                      impact: number;
                                    },
                                    i: number,
                                  ) => (
                                    <div
                                      key={i}
                                      className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-5 shadow-sm hover:shadow-md transition"
                                    >
                                      {/* HEADER */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-base">
                                          <TrendingDown className="h-4 w-4" />
                                          {rec.type}
                                        </div>

                                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                                          -{Math.round(rec.impact * 100)}%
                                        </span>
                                      </div>

                                      {/* MAIN STATS */}
                                      <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div className="rounded-lg bg-background/40 border px-3 py-2">
                                          <p className="text-[11px] text-muted-foreground">
                                            Suggested Loan
                                          </p>
                                          <p className="text-lg font-semibold text-foreground">
                                            {rec.new_loan.toLocaleString()}
                                          </p>
                                          <p className="text-[11px] text-muted-foreground">
                                            {Math.round(rec.pct_kept * 100)}% of original
                                          </p>
                                        </div>

                                        <div className="rounded-lg bg-background/40 border px-3 py-2">
                                          <p className="text-[11px] text-muted-foreground">
                                            New Risk Score
                                          </p>
                                          <p className="text-lg font-semibold text-emerald-400">
                                            {Math.round(rec.risk * 100)}%
                                          </p>
                                          <p className="text-[11px] text-muted-foreground">
                                            after adjustment
                                          </p>
                                        </div>
                                      </div>

                                      {/* FOOTER */}
                                      <div className="mt-4 text-xs text-muted-foreground">
                                        This adjustment lowers default probability by{" "}
                                        <span className="font-medium text-emerald-400">
                                          {Math.round(rec.impact * 100)}%
                                        </span>
                                        .
                                      </div>
                                    </div>
                                  ),
                                )
                              ) : (
                                // ✅ EMPTY STATE (NOW WORKS)
                                <div className={`rounded-2xl border border-amber-500/20 ${decision?.bg} p-5 text-center`}>
                                  <div className="flex flex-col items-center gap-2">
                                    {/* <ShieldAlert className="h-6 w-6 text-amber-400" /> */}
                                    {DecisionIcon && < DecisionIcon className="h-5 w-5" />}
                                    <p className={`text-sm font-semibold ${decision?.border}`}>
                                      No simple recommendation available
                                    </p>

                                    <p className="text-xs text-muted-foreground max-w-xs">
                                      {verdict.recommendations?.message ||
                                        "Try reducing loan amount or improving credit score."}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="text-center">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/">← Back to overview</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Predict;
