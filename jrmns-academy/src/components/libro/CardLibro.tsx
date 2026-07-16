import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";
import type { Libro } from "@/types";
import ValoracionEstrellas from "./ValoracionEstrellas";

export default function CardLibro({ libro }: { libro: Libro }) {
  return (
    <Link
      href={`/libro/${libro.slug}`}
      className="group block w-full shrink-0 rounded-2xl bg-white border border-line overflow-hidden card-hover"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper">
        {libro.portada_url ? (
          <Image
            src={libro.portada_url}
            alt={libro.titulo}
            fill
            sizes="(max-width:768px) 45vw, 220px"
            className="object-cover transition-transform duration-250 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">Sin portada</div>
        )}

        {libro.tipo === "premium" && (
          <span className="absolute top-2 left-2 flex items-center gap-1 bg-deepblue/90 text-white text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur">
            <Sparkles className="w-3 h-3 text-cyan" /> Premium
          </span>
        )}
        {libro.tipo === "gratuito" && (
          <span className="absolute top-2 left-2 bg-white/90 text-deepblue text-[10px] font-semibold px-2 py-1 rounded-full">
            Gratuito
          </span>
        )}
        <span className="absolute bottom-2 right-2 bg-white/90 text-ink text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <Heart className="w-3 h-3" /> {libro.total_favoritos}
        </span>
      </div>

      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-ink leading-snug line-clamp-2 mb-1.5 group-hover:text-electric transition-colors">
          {libro.titulo}
        </h3>
        <ValoracionEstrellas valor={libro.valoracion_promedio} total={libro.total_resenas} />
      </div>
    </Link>
  );
}
