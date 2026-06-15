import { ArrowRight, Search, ShieldCheck, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-farmer.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Plataforma verificada · +12.000 produtores
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            Compre e venda animais com{" "}
            <span className="text-primary">segurança</span> em todo o Brasil.
          </h1>

          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Conectamos produtores rurais, fazendas e compradores em uma única
            plataforma — do leilão à porteira.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/anunciar" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] hover:bg-primary-dark transition">
              Anunciar Animal
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#destaques" className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition">
              <Search className="h-4 w-4" />
              Buscar Animais
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            <Stat value="48k+" label="Anúncios ativos" />
            <Stat value="1.2k" label="Cidades atendidas" />
            <Stat value="4.9★" label="Avaliação média" />
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[var(--shadow-elevated)] lg:aspect-[5/6]">
            <img
              src={heroImg}
              alt="Agricultor sorrindo no campo"
              width={1920}
              height={1280}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent" />


          </div>

          <div className="absolute -left-4 top-8 hidden rounded-2xl bg-card p-4 shadow-[var(--shadow-elevated)] sm:flex sm:items-center sm:gap-3 lg:-left-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Negociações hoje</p>
              <p className="text-sm font-bold text-foreground">+387 fechadas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl font-bold text-primary sm:text-3xl">{value}</dt>
      <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</dd>
    </div>
  );
}
