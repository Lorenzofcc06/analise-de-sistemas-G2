import { ShieldCheck, MessageCircle, Truck, Sparkles } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Perfil verificado",
    desc: "Validação documental do produtor e da fazenda antes da publicação.",
  },
  {
    icon: MessageCircle,
    title: "Chat seguro",
    desc: "Negocie pelo chat interno ou WhatsApp com histórico salvo.",
  },
  {
    icon: Truck,
    title: "Transporte parceiro",
    desc: "Rede de transportadores rurais cotando direto pelo app.",
  },
  {
    icon: Sparkles,
    title: "IA de preços",
    desc: "Sugestão de valor justo baseado em mercado por raça e região.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Negocie com confiança da porteira pra dentro
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Tudo o que sua fazenda precisa para comprar e vender com segurança.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40 transition"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary-dark">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {it.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
