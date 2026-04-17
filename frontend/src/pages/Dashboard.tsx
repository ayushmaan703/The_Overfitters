import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Database,
  Brain,
  FileSearch,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SiteNav from "@/components/SiteNav";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { currentUserInfo } from "../store/slice/userSlice";
import Home from "../components/Home.jsx";

const features = [
  {
    icon: Activity,
    title: "Real-time default scoring",
    body: "Score every loan application in milliseconds using gradient-boosted models trained on 10M+ historical loans.",
  },
  {
    icon: ShieldCheck,
    title: "Explainable & compliant",
    body: "SHAP-based explanations for every prediction so credit teams can justify approvals under fair-lending audits.",
  },
  {
    icon: TrendingUp,
    title: "Cut portfolio losses",
    body: "Detect high-risk borrowers earlier and reduce non-performing loans by acting on leading economic indicators.",
  },
  {
    icon: BarChart3,
    title: "Cohort & scenario analytics",
    body: "Stress-test your book against macro shocks — interest rate spikes, unemployment, and sector slowdowns.",
  },
];

const steps = [
  {
    icon: Database,
    title: "1. Connect borrower data",
    body: "Securely ingest income statements, repayment history, employment records, and bureau scores.",
  },
  {
    icon: Brain,
    title: "2. Run the ML risk engine",
    body: "Our ensemble model evaluates 80+ signals to compute a Probability of Default (PD) for each applicant.",
  },
  {
    icon: FileSearch,
    title: "3. Decide with confidence",
    body: "Get an approve / review / decline recommendation with the top risk drivers explained in plain English.",
  },
];

const signals = [
  "Income stability & debt-to-income ratio",
  "On-time vs. late repayment patterns",
  "Employment tenure & sector volatility",
  "Credit utilization & inquiry velocity",
  "Macroeconomic indicators (CPI, unemployment)",
  "Loan-to-value & collateral quality",
];

const faqs = [
  {
    q: "How accurate is the default prediction model?",
    a: "On held-out test data the model achieves an AUC of 0.89 and outperforms traditional credit scorecards by ~22% in identifying defaulters within the top-decile risk bucket.",
  },
  {
    q: "Is the model fair and bias-free?",
    a: "Yes — we monitor disparate impact across protected attributes and apply post-processing fairness constraints. Every decision ships with a SHAP explanation.",
  },
  {
    q: "What data do I need to get started?",
    a: "A CSV of historical loans with borrower demographics, income, employment, repayment outcomes, and the loan terms is enough to fine-tune the model on your portfolio.",
  },
  {
    q: "Can Credit Wise AI integrate with my LOS?",
    a: "Yes. We expose a REST API so your Loan Origination System can request a risk score in real time during underwriting.",
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your work email");
      return;
    }
    toast.success("We'll be in touch shortly");
    setEmail("");
  };

  useEffect(() => {
    const fetch = async () => {
      dispatch(currentUserInfo());
    };
    fetch();
  }, []);

  return (
    <main className="w-full pb-24">
      {/* Hero Section Container */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-background">
        {/* Background 3D Model */}
        <div className="absolute inset-0 z-0 pointer-events-auto flex items-center justify-center">
          <iframe
            src="https://my.spline.design/boxeshover-dxUC7tInNaRAqE3LamSpujyZ/"
            frameBorder="0"
            width="100%"
            height="100%"
            title="Interactive 3D Background"
            className="h-full w-full scale-[1.5] origin-[50%_40%] sm:scale-[1.8] md:scale-[2]"
          ></iframe>
          <div className="pointer-events-none absolute inset-0 bg-background/20" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Site Navigation */}
        <div className="pointer-events-none absolute top-0 left-0 w-full z-50 pt-6">
           <div className="pointer-events-auto">
             <SiteNav authed />
           </div>
        </div>

        {/* Hero Content positioned at the bottom */}
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 sm:pb-32">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            
            {/* Left Side - Title */}
            <div className="w-full md:w-[55%] text-left">
              <div className="pointer-events-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                AI-powered credit risk, built for modern lenders
              </div>
              <h1 className="pointer-events-auto text-5xl font-bold tracking-tight text-foreground drop-shadow-md sm:text-6xl md:text-7xl">
                Predict loan defaults{" "}
                <br className="hidden md:block" />
                <span className="text-gradient-brand">before they happen</span>
              </h1>
            </div>

            {/* Right Side - Description and Form */}
            <div className="w-full md:w-[40%] text-left flex flex-col gap-6">
              <p className="pointer-events-auto text-base leading-relaxed text-muted-foreground drop-shadow sm:text-lg">
                Credit Wise AI analyzes income patterns, repayment history, employment
                stability, and economic indicators to give your credit team a precise
                probability of default — in milliseconds.
              </p>

              <form
                onSubmit={handleStart}
                className="pointer-events-auto flex w-full flex-col items-stretch gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="Your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-input/80 backdrop-blur"
                />
                <Button
                  type="submit"
                  className="h-11 bg-foreground text-background hover:bg-foreground/90 shrink-0"
                >
                  Request a demo
                </Button>
              </form>

              <div className="pointer-events-auto flex flex-wrap items-center justify-start gap-4">
                <Button
                  asChild
                  className="h-11 bg-gradient-brand text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
                >
                  <Link to="/predict">
                    Try the predictor <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <span className="text-xs text-muted-foreground max-w-[200px]">
                  Trusted by risk teams modeling $4B+ in originations.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto mt-28 w-full max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for credit teams that hate surprises
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to underwrite smarter and shrink your loss
            curve.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border p-6 transition-[transform,box-shadow] hover:-translate-y-0.5"
              style={{
                background: "var(--gradient-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-brand">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto mt-28 w-full max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From raw application to risk verdict in 3 steps
          </h2>
          <p className="mt-3 text-muted-foreground">
            No more spreadsheets, no more gut-feel approvals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border p-6"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-brand-foreground shadow-[var(--shadow-glow)]">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Model signals */}
      <section id="model" className="mx-auto mt-28 w-full max-w-6xl px-6">
        <div
          className="overflow-hidden rounded-3xl border border-border p-8 sm:p-12"
          style={{
            background: "var(--gradient-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                <Brain className="h-3.5 w-3.5 text-brand" />
                Inside the model
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                80+ borrower & macro signals, weighted in real time
              </h2>
              <p className="mt-3 text-muted-foreground">
                Our ensemble combines gradient-boosted trees with a neural
                module for sequential repayment behavior. Trained on diverse
                portfolios — personal, SME, auto, and mortgage.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3">
                  <p className="text-2xl font-bold text-foreground">0.89</p>
                  <p className="text-xs text-muted-foreground">Test AUC</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3">
                  <p className="text-2xl font-bold text-foreground">22%</p>
                  <p className="text-xs text-muted-foreground">
                    Lift over scorecards
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3">
                  <p className="text-2xl font-bold text-foreground">
                    &lt;120ms
                  </p>
                  <p className="text-xs text-muted-foreground">P95 latency</p>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              {signals.map((sig) => (
                <li
                  key={sig}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background/40 px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <span className="text-sm text-foreground">{sig}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto mt-28 w-full max-w-3xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="border-border"
            >
              <AccordionTrigger className="text-left text-base">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 w-full max-w-4xl px-6">
        <div
          className="rounded-3xl border border-border p-10 text-center sm:p-14"
          style={{
            background: "var(--gradient-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to underwrite with confidence?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Plug Credit Wise AI into your loan origination flow and start cutting
            defaults this quarter.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="h-11 bg-gradient-brand text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
            >
              <a href="#features">
                Explore features <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="h-11 bg-transparent">
              <Link to="/">Back to sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
