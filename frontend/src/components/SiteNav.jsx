import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../store/slice/userSlice";

const navItems = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how" },
  { label: "Risk model", href: "/#model" },
  { label: "FAQ", href: "/#faq" },
];

const SiteNav = ({ authed = false }) => {
const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(userLogout());
    toast.success("Signed out");
    navigate("/");
  };
  const authStatus = useSelector((state) => state.user.status);
  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4">
      <nav
        className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-2.5 backdrop-blur-xl sm:px-6"
        style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-card)" }}
      >
        <Link to={authStatus ? "/" : "/login"} className="flex items-center gap-2">
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
          {authStatus ? (
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
            <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90 ">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default SiteNav;
