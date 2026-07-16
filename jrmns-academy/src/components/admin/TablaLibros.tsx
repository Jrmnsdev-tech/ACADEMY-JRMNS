"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Libro } from "@/types";
import { Pencil, EyeOff, Eye } from "lucide-react";

const estadoColor: Record<string, string> = {
  publicado: "bg-green-50 text-green-700 border-green-200",
  borrador: "bg-amber-50 text-amber-700 border-amber-200",
  oculto: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function TablaLibros({ libros: inicial }: { libros: Libro[] }) {
  const [libros, setLibros] = useState(inicial);
  const supabase = createClient();

  async function alternarOculto(libro: Libro) {
    const nuevoEstado = libro.estado === "oculto" ? "publicado" : "oculto";
    await supabase.from("libros").update({ estado: nuevoEstado }).eq("id", libro.id);
    setLibros((prev) => prev.map((l) => (l.id === libro.id ? { ...l, estado: nuevoEstado } : l)));
  }

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-card">
      <table className="w-full text-sm">
        <thead className="bg-paper text-muted text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-5 py-3 font-medium">Libro</th>
            <th className="text-left px-5 py-3 font-medium">Tipo</th>
            <th className="text-left px-5 py-3 font-medium">Estado</th>
            <th className="text-left px-5 py-3 font-medium">Favoritos</th>
            <th className="text-left px-5 py-3 font-medium">Valoración</th>
            <th className="text-right px-5 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((libro) => (
            <tr key={libro.id} className="border-t border-line/60 hover:bg-paper/60">
              <td className="px-5 py-3 font-medium text-ink flex items-center gap-3">
                {libro.portada_url && (
                  <img src={libro.portada_url} className="w-8 h-11 object-cover rounded border border-line" alt="" />
                )}
                {libro.titulo}
              </td>
              <td className="px-5 py-3 capitalize text-muted">{libro.tipo}</td>
              <td className="px-5 py-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${estadoColor[libro.estado]}`}>
                  {libro.estado}
                </span>
              </td>
              <td className="px-5 py-3 text-muted">{libro.total_favoritos}</td>
              <td className="px-5 py-3 text-muted">{libro.valoracion_promedio.toFixed(1)} ★</td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/libros/${libro.id}`} className="p-2 rounded-lg hover:bg-paper text-muted hover:text-electric">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button onClick={() => alternarOculto(libro)} className="p-2 rounded-lg hover:bg-paper text-muted hover:text-electric">
                    {libro.estado === "oculto" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {libros.length === 0 && <p className="text-center text-muted py-14 text-sm">Aún no hay libros. Crea el primero.</p>}
    </div>
  );
}
