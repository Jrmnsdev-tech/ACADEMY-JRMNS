import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/home/Hero";
import FilaLibros from "@/components/home/FilaLibros";
import PreguntaComunidad from "@/components/home/PreguntaComunidad";
import type { Libro } from "@/types";

export const revalidate = 60;

export default async function InicioPage() {
  const supabase = createClient();

  const [{ data: novedades }, { data: favoritos }, { data: mejorValorados }] = await Promise.all([
    supabase
      .from("libros")
      .select("*")
      .eq("estado", "publicado")
      .order("fecha_publicacion", { ascending: false })
      .limit(10),
    supabase
      .from("libros")
      .select("*")
      .eq("estado", "publicado")
      .order("total_favoritos", { ascending: false })
      .limit(10),
    supabase
      .from("libros")
      .select("*")
      .eq("estado", "publicado")
      .gt("total_resenas", 0)
      .order("valoracion_promedio", { ascending: false })
      .limit(10),
  ]);

  return (
    <>
      <Hero />
      <FilaLibros titulo="Novedades" subtitulo="Los últimos libros publicados" libros={(novedades as Libro[]) || []} />
      <FilaLibros titulo="Favoritos de la Comunidad" libros={(favoritos as Libro[]) || []} />
      <FilaLibros titulo="Mejor Valorados" libros={(mejorValorados as Libro[]) || []} />
      <PreguntaComunidad />
    </>
  );
}
