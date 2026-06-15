import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const categories = [
  { id: "all", label: "Todos", emoji: "🌾" },
  { id: "bovino", label: "Bovinos", emoji: "🐂" },
  { id: "equino", label: "Equinos", emoji: "🐎" },
  { id: "ovino", label: "Ovinos", emoji: "🐑" },
  { id: "caprino", label: "Caprinos", emoji: "🐐" },
  { id: "suino", label: "Suínos", emoji: "🐖" },
  { id: "aves", label: "Aves", emoji: "🐓" },
];

export function Categories({ active = "all", onSelect }: { active?: string, onSelect?: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex-1 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 pb-2">
            {categories.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelect?.(c.id)}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  <span className="text-base leading-none">{c.emoji}</span>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
        <button className="shrink-0 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </button>
      </div>
    </div>
  );
}
