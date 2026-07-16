"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Libro } from "@/types";
import { construirLinkWhatsApp } from "@/lib/utils";
import { Heart, BookOpen } from "lucide-react";
import LectorEpub from "./LectorEpub";

export default function SeccionAcciones({ libro, whatsapp }: { libro: Libro; whatsapp: string }) {
  const supabase = createClient();
  const [esFavorito, setEsFavorito] = useState(false);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [correo, setCorreo] = useState<string | undefined>();
  const [leyendo, setLeyendo] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setCorreo(auth.user.email || undefined);
      const { data: perfil } = await supabase.from("usuarios").select("id").eq("auth_id", auth.user.id).single();
      if (!perfil) return;
      setUsuarioId(perfil.id);
      const { data: fav } = await supabase
        .from("favoritos")
        .select("id")
        .eq("usuario_id", perfil.id)
        .eq("libro_id", libro.id)
        .maybeSingle();
      setEsFavorito(!!fav);
    })();
  }, [libro.id]);

  async function alternarFavorito() {
    if (!usuarioId) {
      await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } });
      return;
    }
    if (esFavorito) {
      await supabase.from("favoritos").delete().eq("usuario_id", usuarioId).eq("libro_id", libro.id);
      setEsFavorito(false);
    } else {
      await supabase.from("favoritos").insert({ usuario_id: usuarioId, libro_id: libro.id });
      setEsFavorito(true);
    }
  }

  async function comprar() {
    if (usuarioId) {
      await supabase.from("solicitudes_premium").insert({ usuario_id: usuarioId, libro_id: libro.id });
    }
    window.open(construirLinkWhatsApp(whatsapp, libro.titulo, correo), "_blank");
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mt-7">
        {libro.tipo === "gratuito" ? (
          <button
            onClick={() => setLeyendo(true)}
            className="bg-electric text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-glow"
          >
            <BookOpen className="w-4 h-4" /> Leer
          </button>
        ) : (
          <button
            onClick={comprar}
            className="bg-deepblue text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-glow"
          >
            Comprar
          </button>
        )}
        <button
          onClick={alternarFavorito}
          className={`border font-medium px-5 py-3 rounded-full flex items-center gap-2 transition-colors ${
            esFavorito ? "bg-red-50 border-red-200 text-red-500" : "border-line text-ink hover:border-electric"
          }`}
        >
          <Heart className={`w-4 h-4 ${esFavorito ? "fill-red-500" : ""}`} />
          {esFavorito ? "En favoritos" : "Agregar a favoritos"}
        </button>
      </div>

      {leyendo && libro.epub_url && (
        <LectorEpub libro={libro} onCerrar={() => setLeyendo(false)} usuarioId={usuarioId} />
      )}
    </>
  );
}
