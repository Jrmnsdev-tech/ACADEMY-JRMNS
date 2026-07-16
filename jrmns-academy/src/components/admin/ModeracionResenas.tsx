"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, X, Star } from "lucide-react";

export default function ModeracionResenas({ resenas: inicial }: { resenas: any[] }) {
  const [resenas, setResenas] = useState(inicial);
  const supabase = createClient();

  async function actualizar(id: string, estado: "aprobado" | "rechazado") {
    await supabase.from("resenas").update({ estado }).eq("id", id);
    setResenas((prev) => prev.map((r) => (r.id === id ? { ...r, estado } : r)));
  }

  const pendientes = resenas.filter((r) => r.estado === "pendiente");
  const otras = resenas.filter((r) => r.estado !== "pendiente");

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-sm font-semibold text-muted uppercase mb-3">Pendientes ({pendientes.length})</h2>
        <div className="space-y-3">
          {pendientes.map((r) => (
            <div key={r.id} className="bg-white border border-line rounded-xl p-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-ink">{r.usuarios?.nombre}</span>
                  <span className="text-xs text-muted">→ {r.libros?.titulo}</span>
                </div>
                <div className="flex mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= r.calificacion ? "fill-electric text-electric" : "text-line"}`} />
                  ))}
                </div>
                <p className="text-sm text-ink/80">{r.comentario}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => actualizar(r.id, "aprobado")} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => actualizar(r.id, "rechazado")} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {pendientes.length === 0 && <p className="text-sm text-muted">No hay reseñas pendientes.</p>}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted uppercase mb-3">Historial</h2>
        <div className="space-y-2">
          {otras.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm bg-paper rounded-lg px-4 py-2.5">
              <span>{r.usuarios?.nombre} → {r.libros?.titulo}</span>
              <span className={r.estado === "aprobado" ? "text-green-600" : "text-red-500"}>{r.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
