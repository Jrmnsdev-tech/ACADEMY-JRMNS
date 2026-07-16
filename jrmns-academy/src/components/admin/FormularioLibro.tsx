"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Libro } from "@/types";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

export default function FormularioLibro({ libro }: { libro?: Libro }) {
  const supabase = createClient();
  const router = useRouter();

  const [titulo, setTitulo] = useState(libro?.titulo || "");
  const [descripcion, setDescripcion] = useState(libro?.descripcion_corta || "");
  const [precio, setPrecio] = useState(libro?.precio || 0);
  const [tipo, setTipo] = useState<"gratuito" | "premium">(libro?.tipo || "gratuito");
  const [estadoLibro, setEstadoLibro] = useState<"borrador" | "publicado" | "oculto">(libro?.estado || "borrador");
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [portadaPreview, setPortadaPreview] = useState(libro?.portada_url || "");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  function manejarPortada(f: File | null) {
    setPortadaFile(f);
    if (f) setPortadaPreview(URL.createObjectURL(f));
  }

  async function subirArchivo(bucket: string, file: File, prefijo: string) {
    const nombre = `${prefijo}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from(bucket).upload(nombre, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(nombre);
    return data.publicUrl;
  }

  async function guardar(publicar: boolean) {
    if (!titulo.trim()) {
      setMensaje("El título es obligatorio.");
      return;
    }
    setGuardando(true);
    setMensaje("");
    try {
      let portada_url = libro?.portada_url || "";
      let epub_url = libro?.epub_url || "";

      if (portadaFile) portada_url = await subirArchivo("portadas", portadaFile, "portada");
      if (epubFile) epub_url = await subirArchivo("epubs", epubFile, "epub");

      const payload = {
        titulo: titulo.trim(),
        slug: slugify(titulo),
        descripcion_corta: descripcion.trim(),
        precio: tipo === "gratuito" ? 0 : precio,
        tipo,
        portada_url,
        epub_url,
        estado: publicar ? "publicado" : estadoLibro,
        fecha_publicacion: publicar ? new Date().toISOString() : libro?.fecha_publicacion || null,
      };

      if (libro?.id) {
        const { error } = await supabase.from("libros").update(payload).eq("id", libro.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("libros").insert(payload);
        if (error) throw error;
      }

      router.push("/admin/libros");
      router.refresh();
    } catch (e: any) {
      setMensaje(e.message || "Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-3xl bg-white border border-line rounded-2xl p-8 shadow-card">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-8 mb-6">
        <div>
          <label className="text-xs font-semibold text-muted mb-2 block">Portada</label>
          <label className="block aspect-[3/4] rounded-xl border-2 border-dashed border-line hover:border-electric transition-colors cursor-pointer overflow-hidden bg-paper flex items-center justify-center">
            {portadaPreview ? (
              <img src={portadaPreview} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="text-center text-muted text-xs p-3">
                <UploadCloud className="w-6 h-6 mx-auto mb-1" /> PNG, JPG o JPEG
              </div>
            )}
            <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => manejarPortada(e.target.files?.[0] || null)} />
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted mb-1 block">Título (máx. 120 caracteres)</label>
            <input
              value={titulo}
              maxLength={120}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:ring-2 focus:ring-electric/30"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted mb-1 block">Descripción corta (máx. 300 caracteres)</label>
            <textarea
              value={descripcion}
              maxLength={300}
              rows={3}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:ring-2 focus:ring-electric/30"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted mb-1 block">Archivo EPUB</label>
            <label className="flex items-center gap-2 border border-line rounded-xl p-3 text-sm cursor-pointer hover:border-electric transition-colors">
              <FileText className="w-4 h-4 text-electric" />
              {epubFile?.name || (libro?.epub_url ? "EPUB ya cargado — subir para reemplazar" : "Seleccionar archivo .epub")}
              <input type="file" accept=".epub" className="hidden" onChange={(e) => setEpubFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">Tipo</label>
          <div className="flex gap-2">
            {(["gratuito", "premium"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border capitalize transition-colors ${
                  tipo === t ? "bg-electric text-white border-electric" : "border-line text-ink hover:border-electric"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">Precio</label>
          <input
            type="number"
            disabled={tipo === "gratuito"}
            value={tipo === "gratuito" ? 0 : precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:ring-2 focus:ring-electric/30 disabled:bg-paper disabled:text-muted"
          />
        </div>
      </div>

      {mensaje && <p className="text-sm text-red-500 mb-4">{mensaje}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => guardar(false)}
          disabled={guardando}
          className="border border-line text-ink font-semibold px-5 py-2.5 rounded-full text-sm hover:border-electric transition-colors flex items-center gap-2"
        >
          {guardando && <Loader2 className="w-4 h-4 animate-spin" />} Guardar borrador
        </button>
        <button
          onClick={() => guardar(true)}
          disabled={guardando}
          className="bg-electric text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {guardando && <Loader2 className="w-4 h-4 animate-spin" />} Publicar
        </button>
        <button
          onClick={() => router.push("/admin/libros")}
          className="text-muted font-medium px-5 py-2.5 rounded-full text-sm hover:text-ink transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
