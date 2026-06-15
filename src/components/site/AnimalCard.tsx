import { Heart, MapPin, Camera, Clock, BadgeCheck } from "lucide-react";

export interface Animal {
  id: string;
  titulo: string;
  especie: string;
  raca: string;
  idade: string;
  peso: string;
  quantidade: number;
  cidade: string;
  estado: string;
  preco: number;
  unidade: string;
  fotos: number;
  postedAgo: string;
  image: string;
  verified?: boolean;
}

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function AnimalCard({ animal }: { animal: Animal }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={animal.image}
          alt={animal.titulo}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-primary-dark backdrop-blur">
          {animal.especie}
        </span>
        <button className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/95 text-foreground hover:text-[color:var(--danger)] backdrop-blur transition">
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-foreground/70 px-2 py-1 text-[11px] font-medium text-primary-foreground backdrop-blur">
          <Camera className="h-3 w-3" />
          {animal.fotos}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-tight text-foreground line-clamp-1">
            {animal.titulo}
          </h3>
          {animal.verified && (
            <span title="Anunciante verificado" className="text-primary">
              <BadgeCheck className="h-4 w-4" />
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {animal.raca} · {animal.idade} · {animal.peso}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {animal.cidade}, {animal.estado}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {animal.postedAgo}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {animal.quantidade > 1 ? `${animal.quantidade} cabeças` : "Unitário"}
            </p>
            <p className="font-display text-xl font-bold text-foreground">
              {fmt(animal.preco)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/{animal.unidade}</span>
            </p>
          </div>
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-dark transition">
            Ver
          </button>
        </div>
      </div>
    </article>
  );
}
