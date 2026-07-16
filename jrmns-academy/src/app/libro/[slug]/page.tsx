import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Libro, Resena, Configuracion } from "@/types";
import ValoracionEstrellas from "@/components/libro/ValoracionEstrellas";
import SeccionAcciones from "@/components/libro/SeccionAcciones";
import SeccionResenas from "@/components/libro/SeccionResenas";
import { formatearFecha } from "@/lib/utils";

export const revalidate = 30;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: libro } = await supabase.from("libros").select("*").eq("slug", params.slug).single();
  if (!libro) return {};
  return {
    title: `${libro.titulo} — JRMN'S Academy IA`,
    description: libro.descripcion_corta,
    openGraph: { images: libro.portada_url ? [libro.portada_url] : [] },
  };
}

export default async function LibroPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: libro } = await supabase
    .from("libros")
    .select("*")
    .eq("slug", params.slug)
    .eq("estado", "publicado")
    .single<Libro>();

  if (!libro) notFound();

  const [{ data: resenas }, { data: config }] = await Promise.all([
    supabase
      .from("resenas")
      .select("*, usuarios(nombre, foto_perfil)")
      .eq("libro_id", libro.id)
      .eq("estado", "aprobado")
      .order("fecha", { ascending: false }),
    supabase.from("configuracion").select("*").single<Configuracion>(),
  ]);

  supabase.from("libros").update({ vistas: libro.vistas + 1 }).eq("id", libro.id).then();

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10">
        <div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-line shadow-soft">
            {libro.portada_url ? (
              <Image src={libro.portada_url} alt={libro.titulo} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-paper flex items-center justify-center text-muted">Sin portada</div>
            )}
          </div>
        </div>

        <div>
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-paper border border-line text-deepblue mb-3">
            {libro.tipo === "premium" ? "Premium" : "Gratuito"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-deepblue leading-tight mb-3">{libro.titulo}</h1>
          <ValoracionEstrellas valor={libro.valoracion_promedio} total={libro.total_resenas} tamano="md" />
          <p className="text-muted mt-5 leading-relaxed">{libro.descripcion_corta}</p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted">
            <span>Publicado el {libro.fecha_publicacion ? formatearFecha(libro.fecha_publicacion) : "—"}</span>
            <span>·</span>
            <span>{libro.total_favoritos} favoritos</span>
            {libro.tipo === "premium" && (
              <>
                <span>·</span>
                <span className="font-semibold text-deepblue">${libro.precio.toLocaleString("es-CL")}</span>
              </>
            )}
          </div>

          <SeccionAcciones libro={libro} whatsapp={config?.whatsapp || ""} />
        </div>
      </div>

      <SeccionResenas libro={libro} resenas={(resenas as Resena[]) || []} />
    </div>
  );
}
