"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Libro, Resena } from "@/types";
import { Star } from "lucide-react";
import { formatearFecha } from "@/lib/utils";

export default function SeccionResenas({ libro, resenas }: { libro: Libro; resenas: Resena[] }) {
  const supabase = createClient();
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  async function enviarResena() {
    if (calificacion === 0) return;
    setEstado("enviando");
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setEstado("error");
      return;
    }
    const { data: perfil } = await supabase.from("usuarios").select("id").eq("auth_id", auth.user.id).single();
    const { error } = await supabase.from("resenas").upsert(
      {
        usuario_id: perfil?.id,
        libro_id: libro.id,
        calificacion,
        comentario,
        estado: "pendiente",
      },
      { onConflict: "usuario_id,libro_id" }
    );
    if (error) setEstado("error");
    else {
      setEstado("ok");
      setComentario("");
    }
  }

  return (
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="text-2xl font-bold text-deepblue mb-6">Reseñas de la Comunidad</h2>

      <div className="space-y-6 mb-10">
        {resenas.length === 0 && <p className="text-muted text-sm">Aún no hay reseñas para este libro.</p>}
        {resenas.map((r) => (
          <div key={r.id} className="flex gap-3">
            <img
              src={r.usuarios?.foto_perfil || "/avatar-default.svg"}
              className="w-9 h-9 rounded-full border border-line shrink-0"
              alt=""
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-ink">{r.usuarios?.nombre}</span>
                <span className="text-xs text-muted">{formatearFecha(r.fecha)}</span>
              </div>
              <div className="flex my-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i <= r.calificacion ? "fill-electric text-electric" : "text-line"}`} />
                ))}
              </div>
              <p className="text-sm text-ink/80 leading-relaxed">{r.comentario}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-paper rounded-2xl p-6 border border-line">
        <h3 className="font-semibold text-ink mb-3 text-sm">Deja tu reseña</h3>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setCalificacion(i)}>
              <Star className={`w-6 h-6 ${i <= calificacion ? "fill-electric text-electric" : "text-line"}`} />
            </button>
          ))}
        </div>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comparte tu experiencia con este libro…"
          rows={3}
          className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:ring-2 focus:ring-electric/30 mb-3"
        />
        <button
          onClick={enviarResena}
          disabled={estado === "enviando"}
          className="bg-electric text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
        >
          Enviar reseña
        </button>
        {estado === "ok" && <p className="text-xs text-green-600 mt-2">¡Gracias! Tu reseña quedó pendiente de aprobación.</p>}
        {estado === "error" && <p className="text-xs text-red-500 mt-2">Inicia sesión con Google para dejar una reseña.</p>}
      </div>
    </section>
  );
}
