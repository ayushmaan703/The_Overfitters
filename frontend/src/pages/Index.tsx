import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, TrendingUp, BarChart3, Sparkles, Activity } from "lucide-react";
import { toast } from "sonner";

const features = [
  {
    icon: Activity,
    title: "Real-time risk scoring",
    description:
      "Score every applicant in milliseconds with an ML model trained on income, repayment, and employment signals.",
  },
  {
    icon: ShieldCheck,
    title: "Built for compliance",
    description:
      "Explainable predictions with audit trails so credit teams can justify every approval and rejection.",
  },
  {
    icon: TrendingUp,
    title: "Reduce default losses",
    description:
      "Catch high-risk borrowers earlier and cut portfolio defaults by acting on leading economic indicators.",
  },
  {
    icon: BarChart3,
    title: "Portfolio intelligence",
    description:
      "Dashboards that surface concentration risk, cohort trends, and scenario forecasts at a glance.",
  },
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome back to RiskLens");
      navigate("/dashboard");
    }, 900);
  };

  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16">
        {/* Left: brand + features */}
        <section className="order-2 lg:order-1">
          <div className="mb-10 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-[var(--shadow-glow)]">
              <Sparkles className="h-5 w-5 text-brand-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-gradient-brand">
              RiskLens
            </span>
          </div>

          <h1 className="sr-only">RiskLens — AI-Powered Loan Default Prediction</h1>

          <ul className="space-y-7">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-brand">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">{f.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Right: sign in card */}
        <section className="order-1 lg:order-2">
          <div
            className="mx-auto w-full max-w-md rounded-2xl border border-border p-8 sm:p-10"
            style={{
              background: "var(--gradient-card)",
              boxShadow: "var(--shadow-card)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-foreground">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your loan risk intelligence dashboard.
            </p>

            <form onSubmit={handleSignIn} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-input/60"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => toast("Password reset link sent if account exists")}
                    className="text-sm font-medium text-brand underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-input/60"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(v === true)}
                />
                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-foreground text-background hover:bg-foreground/90"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => toast("Sign up coming soon")}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Sign up
                </button>
              </p>

              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full bg-transparent hover:bg-secondary"
                  onClick={() => toast("Google sign-in coming soon")}
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Sign in with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full bg-transparent hover:bg-secondary"
                  onClick={() => toast("Microsoft sign-in coming soon")}
                >
                  <MicrosoftIcon className="mr-2 h-4 w-4" />
                  Sign in with Microsoft
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.3 14.7 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"
    />
  </svg>
);

const MicrosoftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
    <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
    <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
    <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
  </svg>
);

export default Index;
