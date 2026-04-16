import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { label: "Features", href: "/dashboard#features" },
  { label: "How it works", href: "/dashboard#how" },
  { label: "Risk model", href: "/dashboard#model" },
  { label: "Predict", href: "/predict" },
  { label: "FAQ", href: "/dashboard#faq" },
];

const SiteNav = ({ authed = false }: { authed?: boolean }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4">
      <nav
        className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-2.5 backdrop-blur-xl sm:px-6"
        style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-card)" }}
      >
        <Link to={authed ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand shadow-[var(--shadow-glow)]">
            <Sparkles className="h-4 w-4 text-brand-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight text-gradient-brand">
            RiskLens
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {authed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="bg-transparent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          ) : (
            <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90">
              <Link to="/">Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default SiteNav;
