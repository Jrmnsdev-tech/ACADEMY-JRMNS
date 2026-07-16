"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Libro } from "@/types";
import { X, ChevronLeft, ChevronRight, Sun, Moon, Type, Minus, Plus } from "lucide-react";

export default function LectorEpub({
  libro,
  onCerrar,
  usuarioId,
}: {
  libro: Libro;
  onCerrar: () => void;
  usuarioId: string | null;
}) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<any>(null);
  const bookRef = useRef<any>(null);
  const supabase = createClient();

  const [progreso, setProgreso] = useState(0);
  const [tamanoFuente, setTamanoFuente] = useState(100);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    (async () => {
      const ePub = (await import("epubjs")).default;
      if (!activo || !libro.epub_url || !contenedorRef.current) return;

      const book = ePub(libro.epub_url);
      bookRef.current = book;
      const rendition = book.renderTo(contenedorRef.current, {
        width: "100%",
        height: "100%",
        spread: "auto",
      });
      renditionRef.current = rendition;

      let cfiInicial: string | undefined;
      if (usuarioId) {
        const { data: prog } = await supabase
          .from("progreso_lectura")
          .select("ubicacion_cfi, porcentaje")
          .eq("usuario_id", usuarioId)
          .eq("libro_id", libro.id)
          .maybeSingle();
        if (prog?.ubicacion_cfi) cfiInicial = prog.ubicacion_cfi;
        if (prog?.porcentaje) setProgreso(prog.porcentaje);
      }

      await rendition.display(cfiInicial);
      setCargando(false);

      rendition.on("relocated", async (location: any) => {
        const pct = Math.round((location.start.percentage || 0) * 100);
        setProgreso(pct);
        if (usuarioId) {
          await supabase.from("progreso_lectura").upsert(
            {
              usuario_id: usuarioId,
              libro_id: libro.id,
              porcentaje: pct,
              ubicacion_cfi: location.start.cfi,
              actualizado_en: new Date().toISOString(),
            },
            { onConflict: "usuario_id,libro_id" }
          );
        }
      });
    })();

    return () => {
      activo = false;
      bookRef.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libro.id]);

  useEffect(() => {
    renditionRef.current?.themes?.fontSize(`${tamanoFuente}%`);
  }, [tamanoFuente]);

  useEffect(() => {
    if (!renditionRef.current) return;
    renditionRef.current.themes.register("oscuro", {
      body: { background: "#111827", color: "#EAEAEA" },
    });
    renditionRef.current.themes.register("claro", {
      body: { background: "#FAF9F6", color: "#111827" },
    });
    renditionRef.current.themes.select(modoOscuro ? "oscuro" : "claro");
  }, [modoOscuro]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col ${modoOscuro ? "bg-[#111827]" : "bg-warmwhite"}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-line/20">
        <button onClick={onCerrar} className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100">
          <X className="w-5 h-5" /> Cerrar
        </button>
        <span className="text-xs opacity-60 truncate max-w-[40%]">{libro.titulo}</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setTamanoFuente((s) => Math.max(70, s - 10))} className="opacity-70 hover:opacity-100">
            <Minus className="w-4 h-4" />
          </button>
          <Type className="w-4 h-4 opacity-50" />
          <button onClick={() => setTamanoFuente((s) => Math.min(180, s + 10))} className="opacity-70 hover:opacity-100">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => setModoOscuro((m) => !m)} className="opacity-70 hover:opacity-100">
            {modoOscuro ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="relative flex-1">
        {cargando && (
          <div className="absolute inset-0 flex items-center justify-center text-sm opacity-60">Cargando libro…</div>
        )}
        <button
          onClick={() => renditionRef.current?.prev()}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-2 opacity-40 hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div ref={contenedorRef} className="w-full h-full" />
        <button
          onClick={() => renditionRef.current?.next()}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-2 opacity-40 hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="h-1 bg-line/30">
        <div className="h-full bg-electric transition-all duration-300" style={{ width: `${progreso}%` }} />
      </div>
      <div className="text-center text-[11px] opacity-50 py-1.5">{progreso}% leído</div>
    </div>
  );
}
