"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";

export default function PreguntaComunidad() {
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");
  const supabase = createClient();

  async function enviar() {
    if (!texto.trim()) return;
    setEstado("enviando");
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setEstado("error");
      return;
    }
    const { data: perfil } = await supabase
      .from("usuarios")
      .select("id")
      .eq("auth_id", auth.user.id)
      .single();

    const { error } = await supabase
      .from("sugerencias_comunidad")
      .insert({ usuario_id: perfil?.id, contenido: texto.trim() });

    if (error) setEstado("error");
    else {
      setEstado("ok");
      setTexto("");
    }
  }

  return (
    <section className="bg-deepblue text-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          ¿Qué libro te gustaría que publiquemos?
        </h2>
        <p className="text-white/70 mb-8 text-sm">
          Tus sugerencias ayudan a construir la biblioteca de IA más útil en español.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej: Un libro sobre agentes de IA para empresas"
            className="flex-1 rounded-full px-5 py-3 text-ink bg-white/95 outline-none focus:ring-2 focus:ring-cyan text-sm"
          />
          <button
            onClick={enviar}
            disabled={estado === "enviando"}
            className="bg-electric hover:bg-blue-600 transition-colors px-5 py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Enviar
          </button>
        </div>
        {estado === "ok" && <p className="text-cyan text-sm mt-4">¡Gracias! Tu sugerencia quedó registrada.</p>}
        {estado === "error" && (
          <p className="text-red-300 text-sm mt-4">Inicia sesión con Google para enviar una sugerencia.</p>
        )}
      </div>
    </section>
  );
}
