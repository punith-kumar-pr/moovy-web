import { Film } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5">
              <Film className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">
              Moo<span className="text-primary">vy</span>
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/browse" className="hover:text-foreground transition-colors">Browse</Link>
            <Link to="/watchlist" className="hover:text-foreground transition-colors">Watchlist</Link>
            <a
              href="https://github.com/punith-kumar-pr/Moovy-server"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Film className="h-4 w-4" /> GitHub
            </a>
          </nav>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Moovy. Built by Punith Kumar P R.
          </p>
        </div>
      </div>
    </footer>
  );
}
