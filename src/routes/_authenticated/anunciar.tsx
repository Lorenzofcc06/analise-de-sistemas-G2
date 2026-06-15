import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/anunciar")({
  component: AnunciarPage,
});

const CATEGORIES = [
  { value: "bovino", label: "Bovino" },
  { value: "equino", label: "Equino" },
  { value: "ovino", label: "Ovino" },
  { value: "caprino", label: "Caprino" },
  { value: "suino", label: "Suíno" },
  { value: "aves", label: "Aves" },
  { value: "outros", label: "Outros" },
];

function AnunciarPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "bovino",
    breed: "",
    sex: "" as "" | "macho" | "femea",
    age_months: "",
    weight_kg: "",
    quantity: "1",
    price: "",
    price_per_unit: "false",
    city: "",
    state: "",
    image_url: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada");

      let finalImageUrl = "";

      // Se o usuário selecionou um arquivo de imagem, faz o upload para o Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
          
        finalImageUrl = publicUrl;
      }

      const { error } = await supabase.from("animals").insert({
        owner_id: user.id,
        title: form.title,
        description: form.description || null,
        category: form.category as any,
        breed: form.breed || null,
        sex: (form.sex || null) as any,
        age_months: form.age_months ? parseInt(form.age_months) : null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        quantity: parseInt(form.quantity) || 1,
        price: parseFloat(form.price),
        price_per_unit: form.price_per_unit === "true",
        city: form.city,
        state: form.state.toUpperCase(),
        images: finalImageUrl ? [finalImageUrl] : [],
      });
      if (error) throw error;
      toast.success("Anúncio publicado!");
      navigate({ to: "/meus-anuncios" });
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao publicar");
    } finally {
      setLoading(false);
    }
  }

  const input = "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:border-primary";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <Link to="/meus-anuncios" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">Novo anúncio</h1>
        <p className="text-sm text-muted-foreground mb-8">Preencha os detalhes do animal ou lote</p>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Título *</label>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Lote de Nelore PO" className={input} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Categoria *</label>
              <select required value={form.category} onChange={(e) => set("category", e.target.value)} className={input}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Raça</label>
              <input value={form.breed} onChange={(e) => set("breed", e.target.value)} placeholder="Ex: Nelore" className={input} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Sexo</label>
              <select value={form.sex} onChange={(e) => set("sex", e.target.value)} className={input}>
                <option value="">—</option>
                <option value="macho">Macho</option>
                <option value="femea">Fêmea</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Idade (meses)</label>
              <input type="number" min="0" value={form.age_months} onChange={(e) => set("age_months", e.target.value)} className={input} />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Peso (kg)</label>
              <input type="number" step="0.1" min="0" value={form.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} className={input} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Quantidade *</label>
              <input required type="number" min="1" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className={input} />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Preço (R$) *</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className={input} />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Cobrança</label>
              <select value={form.price_per_unit} onChange={(e) => set("price_per_unit", e.target.value)} className={input}>
                <option value="false">Total do lote</option>
                <option value="true">Por cabeça</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-semibold mb-1.5 block">Cidade *</label>
              <input required value={form.city} onChange={(e) => set("city", e.target.value)} className={input} />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">UF *</label>
              <input required maxLength={2} value={form.state} onChange={(e) => set("state", e.target.value.toUpperCase())} className={`${input} uppercase`} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-1.5 block">Foto do animal (opcional)</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                <span>Escolher arquivo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
              {imageFile && <span className="text-sm text-muted-foreground">{imageFile.name}</span>}
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-border" />
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold mb-1.5 block">Descrição</label>
            <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className={input} placeholder="Detalhes sobre saúde, manejo, vacinação..." />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Publicar anúncio"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
