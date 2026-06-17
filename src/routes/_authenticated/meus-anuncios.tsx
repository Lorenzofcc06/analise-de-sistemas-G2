import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { faro } from '@grafana/faro-web-sdk';

export const Route = createFileRoute("/_authenticated/meus-anuncios")({
  component: MyListings,
});

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function MyListings() {
  const qc = useQueryClient();
  const { data: animals, isLoading } = useQuery({
    queryKey: ["my-animals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function toggleStatus(id: string, current: string) {
    const next = current === "ativo" ? "vendido" : "ativo";
    const { error } = await supabase.from("animals").update({ status: next }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(next === "ativo" ? "Anúncio reativado" : "Marcado como vendido");
    
    // Rastreamento: Empurra a ação do produtor para o Grafana Faro
    faro.api.pushEvent(next === "ativo" ? 'anuncio_reativado' : 'anuncio_vendido', { id_do_animal: id });
    
    qc.invalidateQueries({ queryKey: ["my-animals"] });
  }

  async function remove(id: string) {
    if (!confirm("Excluir este anúncio?")) return;
    const { error } = await supabase.from("animals").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Anúncio excluído");
    qc.invalidateQueries({ queryKey: ["my-animals"] });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">Meus anúncios</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie seus animais publicados</p>
          </div>
          <Link
            to="/anunciar"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark transition"
          >
            <Plus className="h-4 w-4" /> Novo anúncio
          </Link>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Carregando...</p>
        ) : !animals?.length ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="font-display text-lg font-semibold mb-2">Nenhum anúncio ainda</p>
            <p className="text-sm text-muted-foreground mb-6">Publique seu primeiro animal e comece a vender</p>
            <Link
              to="/anunciar"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark transition"
            >
              <Plus className="h-4 w-4" /> Criar anúncio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {animals.map((a) => (
              <article
                key={a.id}
                className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="sm:w-40 h-32 sm:h-28 rounded-xl overflow-hidden bg-secondary shrink-0">
                  {getImageUrl(a.images) ? (
                    <img src={getImageUrl(a.images)!} alt={a.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/f1f5f9/64748b?text=Sem+foto"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem foto</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-foreground line-clamp-1">{a.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        a.status === "ativo"
                          ? "bg-primary/10 text-primary"
                          : a.status === "vendido"
                            ? "bg-foreground/10 text-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {a.breed ?? "—"} · {a.city}, {a.state} · {a.quantity} {a.quantity > 1 ? "cabeças" : "unidade"}
                  </p>
                  <p className="font-display text-lg font-bold mt-2">{fmt(Number(a.price))}</p>
                </div>
                <div className="flex sm:flex-col gap-2 sm:justify-center">
                  <Link
                    to="/animal/$id"
                    params={{ id: a.id }}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition"
                  >
                    Ver
                  </Link>
                  <Link
                    to="/editar/$id"
                    params={{ id: a.id }}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition"
                  >
                    <Pencil className="h-3 w-3" /> Editar
                  </Link>
                  <button
                    data-faro-user-action-name="Alternar_Status_Anuncio"
                    onClick={() => toggleStatus(a.id, a.status)}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition"
                  >
                    {a.status === "ativo" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {a.status === "ativo" ? "Vendido" : "Reativar"}
                  </button>
                  <button
                    data-faro-user-action-name="Excluir_Anuncio"
                    onClick={() => remove(a.id)}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-[color:var(--danger)] hover:bg-secondary transition"
                  >
                    <Trash2 className="h-3 w-3" /> Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
