import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-lg font-bold text-foreground">
              Rural<span className="text-primary">Place</span>
            </span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a className="hover:text-primary" href="#">Sobre</a>
            <a className="hover:text-primary" href="#">Planos</a>
            <a className="hover:text-primary" href="#">Serviços</a>
            <a className="hover:text-primary" href="#">Segurança</a>
            <a className="hover:text-primary" href="#">Contato</a>
          </nav>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} RuralPlace · O marketplace do agronegócio brasileiro.
        </p>
      </div>
    </footer>
  );
}
