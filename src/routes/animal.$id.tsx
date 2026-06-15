import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MapPin, Phone, ArrowLeft, BadgeCheck } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

export const Route = createFileRoute("/animal/$id")({
  component: AnimalDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto p-12 text-center">
        <h1 className="font-display text-2xl font-bold">Anúncio não encontrado</h1>
        <Link to="/" className="inline-block mt-4 text-primary font-semibold">Voltar ao início</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-12 text-center text-sm">{error.message}</div>,
});

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function AnimalDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["animal", id],
    queryFn: async () => {
      const { data: animal, error } = await supabase
        .from("animals")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!animal) throw notFound();
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, city, state, user_type")
        .eq("id", animal.owner_id)
        .maybeSingle();
      return { animal, profile };
    },
  });

  if (isLoading) return <div className="p-12 text-center text-sm text-muted-foreground">Carregando...</div>;
  if (!data || !data.animal) return null;
  const { animal, profile } = data;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
              {getImageUrl(animal.images) ? (
                <img src={getImageUrl(animal.images)!} alt={animal.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/f1f5f9/64748b?text=Sem+foto"; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem foto</div>
              )}
            </div>

            <div className="mt-6">
              <span className="inline-block rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold uppercase">
                {animal.category}
              </span>
              <h1 className="font-display text-3xl font-bold mt-3">{animal.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{animal.city}, {animal.state}</span>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ["Raça", animal.breed ?? "—"],
                  ["Sexo", animal.sex ?? "—"],
                  ["Idade", animal.age_months ? `${animal.age_months} meses` : "—"],
                  ["Peso", animal.weight_kg ? `${animal.weight_kg} kg` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border bg-card p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</p>
                    <p className="text-sm font-semibold mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              {animal.description && (
                <div className="mt-6">
                  <h2 className="font-display text-lg font-bold mb-2">Descrição</h2>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{animal.description}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 sticky top-24">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {animal.quantity > 1 ? `${animal.quantity} cabeças` : "Unidade"} · {animal.price_per_unit ? "por cabeça" : "total"}
              </p>
              <p className="font-display text-3xl font-bold mt-1">{fmt(Number(animal.price))}</p>

              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Anunciante</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{profile?.full_name ?? "Produtor"}</p>
                  <BadgeCheck className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground capitalize">{profile?.user_type}</p>
                {profile?.city && (
                  <p className="text-xs text-muted-foreground mt-1">{profile.city}, {profile.state}</p>
                )}

                {profile?.phone ? (
                  <a
                    href={`https://wa.me/55${profile.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark transition"
                  >
                    <Phone className="h-4 w-4" /> Contatar
                  </a>
                ) : (
                  <Link
                    to="/auth"
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark transition"
                  >
                    Entrar para contatar
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
