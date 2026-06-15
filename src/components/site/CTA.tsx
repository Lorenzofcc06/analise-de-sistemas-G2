import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light p-8 sm:p-12 lg:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl">
            Anuncie seu rebanho e venda mais rápido.
          </h2>
          <p className="mt-3 text-base text-primary-foreground/80">
            Cadastro grátis. Publique seu animal em minutos e fale direto com o comprador.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/anunciar" className="inline-flex items-center gap-2 rounded-full bg-card px-6 py-3.5 text-sm font-semibold text-primary-dark hover:bg-card/90 transition shadow-[var(--shadow-elevated)]">
              Criar anúncio grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
