import { Search, Menu, User, Plus, LogOut, LayoutGrid } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { faro } from '@grafana/faro-web-sdk';

export function Header() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo />
          <span className="font-display text-lg font-bold text-foreground hidden sm:block">
            Rural<span className="text-primary">Place</span>
          </span>
        </Link>

        <div className="flex flex-1 items-center gap-2 max-w-2xl mx-auto">
          <form
            data-faro-user-action-name="Pesquisa_Header"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = formData.get("q") as string;
              if (q) {
                // Rastreamento Manual nos Logs
                faro.api.pushEvent('pesquisa_realizada', { termoBuscado: q });
                navigate({ to: "/", search: { q }, hash: "anuncios" });
              } else {
                navigate({ to: "/", search: {}, hash: "anuncios" });
              }
            }}
            className="relative flex-1"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              type="text"
              placeholder="Buscar por espécie, raça, cidade ou anunciante"
              className="w-full rounded-full border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition"
            />
          </form>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {!loading && user ? (
            <>
              <Link
                to="/meus-anuncios"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                <LayoutGrid className="h-4 w-4" /> Meus anúncios
              </Link>
              <Link
                to="/anunciar"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark transition"
              >
                <Plus className="h-4 w-4" /> Anunciar
              </Link>
              <button
                onClick={signOut}
                title="Sair"
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                <User className="h-4 w-4" /> Entrar
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark transition"
              >
                <Plus className="h-4 w-4" /> Anunciar
              </Link>
            </>
          )}
        </nav>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden rounded-full p-2 text-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-2">
          {user ? (
            <>
              <Link to="/meus-anuncios" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm font-semibold rounded hover:bg-secondary">Meus anúncios</Link>
              <Link to="/anunciar" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm font-semibold rounded bg-primary text-primary-foreground">Anunciar</Link>
              <button onClick={signOut} className="px-3 py-2 text-sm font-semibold rounded hover:bg-secondary text-left">Sair</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm font-semibold rounded bg-primary text-primary-foreground text-center">Entrar / Anunciar</Link>
          )}
        </div>
      )}
    </header>
  );
}
