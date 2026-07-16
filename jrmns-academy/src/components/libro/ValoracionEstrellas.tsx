import { Star } from "lucide-react";

export default function ValoracionEstrellas({
  valor,
  total,
  tamano = "sm",
}: {
  valor: number;
  total?: number;
  tamano?: "sm" | "md";
}) {
  const size = tamano === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${size} ${i <= Math.round(valor) ? "fill-electric text-electric" : "text-line"}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted font-medium">
        {valor > 0 ? valor.toFixed(1) : "Nuevo"}
        {total !== undefined && total > 0 ? ` (${total})` : ""}
      </span>
    </div>
  );
}
