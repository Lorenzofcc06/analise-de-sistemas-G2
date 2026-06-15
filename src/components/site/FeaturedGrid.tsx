import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MapPin, BadgeCheck } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const CAT_LABEL: Record<string, string> = {
  bovino: "Bovino", equino: "Equino", ovino: "Ovino", caprino: "Caprino",
  suino: "Suíno", aves: "Aves", outros: "Outros",
};

export function FeaturedGrid({ category = "all" }: { category?: string }) {
  const { data: animals, isLoading } = useQuery({
    queryKey: ["featured-animals", category],
    queryFn: async () => {
      let q = supabase
        .from("animals")
        .select("id,title,category,breed,age_months,weight_kg,quantity,price,price_per_unit,city,state,images,created_at")
        .eq("status", "ativo");
      
      if (category !== "all") {
        q = q.eq("category", category as any);
      }
      
      const { data, error } = await q
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <section id="destaques" className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Anúncios em destaque
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Os mais recentes publicados na plataforma
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : !animals?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg font-semibold mb-2">Ainda sem anúncios</p>
          <p className="text-sm text-muted-foreground mb-4">Seja o primeiro a publicar um animal</p>
          <Link to="/anunciar" className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Anunciar agora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {animals.map((a) => (
            <Link
              key={a.id}
              to="/animal/$id"
              params={{ id: a.id }}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                {getImageUrl(a.images) ? (
                  <img
                    src={getImageUrl(a.images)!}
                    alt={a.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/f1f5f9/64748b?text=Sem+foto"; }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sem foto</div>
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-primary-dark backdrop-blur">
                  {CAT_LABEL[a.category] ?? a.category}
                </span>
                <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/95 text-foreground backdrop-blur">
                  <Heart className="h-4 w-4" />
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-semibold leading-tight text-foreground line-clamp-1">
                    {a.title}
                  </h3>
                  <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[a.breed, a.age_months ? `${a.age_months} meses` : null, a.weight_kg ? `${a.weight_kg} kg` : null].filter(Boolean).join(" · ") || "—"}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {a.city}, {a.state}
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {a.quantity > 1 ? `${a.quantity} cabeças` : "Unitário"}
                    </p>
                    <p className="font-display text-xl font-bold text-foreground">
                      {fmt(Number(a.price))}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        /{a.price_per_unit ? "cab" : "total"}
                      </span>
                    </p>
                  </div>
                  <span className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                    Ver
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
