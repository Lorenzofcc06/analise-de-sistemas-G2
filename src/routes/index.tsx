import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Categories } from "@/components/site/Categories";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { TrustSection } from "@/components/site/TrustSection";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    return {
      q: typeof search.q === "string" ? search.q : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "RuralPlace — Marketplace de Compra e Venda de Animais" },
      {
        name: "description",
        content:
          "Compre e venda bovinos, equinos, ovinos, caprinos, suínos e aves com segurança. O marketplace do agronegócio brasileiro.",
      },
      { property: "og:title", content: "RuralPlace — Marketplace do Agronegócio" },
      {
        property: "og:description",
        content: "Conectamos produtores, fazendas e compradores em uma única plataforma.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { q } = Route.useSearch();
  const [category, setCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div className="py-6">
          <Categories active={category} onSelect={setCategory} />
        </div>
        <FeaturedGrid category={category} searchQuery={q} />
        <TrustSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
