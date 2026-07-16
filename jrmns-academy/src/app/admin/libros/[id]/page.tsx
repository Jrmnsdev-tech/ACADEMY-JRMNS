import { createClient } from "@/lib/supabase/server";
import FormularioLibro from "@/components/admin/FormularioLibro";
import type { Libro } from "@/types";
import { notFound } from "next/navigation";

export default async function EditarLibroPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: libro } = await supabase.from("libros").select("*").eq("id", params.id).single<Libro>();
  if (!libro) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-deepblue mb-1">Editar Libro</h1>
      <p className="text-muted text-sm mb-8">{libro.titulo}</p>
      <FormularioLibro libro={libro} />
    </div>
  );
}
