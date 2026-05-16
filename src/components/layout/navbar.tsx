import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Film,
  Search,
  Menu,
  X,
  Bookmark,
  Eye,
  Star,
  FileText,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/features/auth/auth-store";

export function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Browse", href: "/browse", icon: <Search className="h-4 w-4" /> },
  ];

  const authLinks = [
    { label: "Watchlist", href: "/watchlist", icon: <Bookmark className="h-4 w-4" /> },
    { label: "Watched", href: "/watched", icon: <Eye className="h-4 w-4" /> },
    { label: "Ratings", href: "/ratings", icon: <Star className="h-4 w-4" /> },
    { label: "Reviews", href: "/reviews", icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="rounded-lg bg-primary p-1.5 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
            <Film className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Moo<span className="text-primary">vy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button variant="ghost" size="sm" className="gap-2">
                {link.icon}
                {link.label}
              </Button>
            </Link>
          ))}
          {isAuthenticated &&
            authLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button variant="ghost" size="sm" className="gap-2">
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hidden md:flex"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{user?.username}</span>
              </Button>

              {/* Desktop dropdown */}
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-popover p-1 shadow-xl z-50 animate-fade-in">
                    <Link to="/profile" onClick={() => setProfileOpen(false)}>
                      <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
                        <User className="h-4 w-4" /> Profile
                      </button>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)}>
                        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
                          <Shield className="h-4 w-4" /> Admin
                        </button>
                      </Link>
                    )}
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <div className="h-px bg-border my-2" />
                {authLinks.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      {link.icon}
                      {link.label}
                    </Button>
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" /> Profile
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Shield className="h-4 w-4" /> Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <div className="h-px bg-border my-2" />
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
