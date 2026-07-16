import { createClient } from "@/lib/supabase/server";
import CardLibro from "@/components/libro/CardLibro";
import BuscadorBiblioteca from "@/components/libro/BuscadorBiblioteca";
import type { Libro } from "@/types";
import { Sparkles } from "lucide-react";

export const revalidate = 60;
export const metadata = { title: "Biblioteca Premium — JRMN'S Academy IA" };

export default async function PremiumPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = createClient();
  let query = supabase.from("libros").select("*").eq("estado", "publicado").eq("tipo", "premium");

  if (searchParams.q) {
    query = query.or(`titulo.ilike.%${searchParams.q}%,descripcion_corta.ilike.%${searchParams.q}%`);
  }

  const { data: libros } = await query.order("fecha_publicacion", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-deepblue mb-2 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-electric" /> Biblioteca Premium
        </h1>
        <p className="text-muted text-sm">Contenido exclusivo desarrollado por JRMN'S.</p>
      </div>

      <BuscadorBiblioteca placeholder="Buscar en la colección premium…" basePath="/premium" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-8">
        {(libros as Libro[])?.map((libro) => (
          <CardLibro key={libro.id} libro={libro} />
        ))}
      </div>

      {(!libros || libros.length === 0) && (
        <p className="text-center text-muted py-20">Aún no hay libros premium publicados.</p>
      )}
    </div>
  );
}
