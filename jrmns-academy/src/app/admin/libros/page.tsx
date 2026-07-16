import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Libro } from "@/types";
import { Plus } from "lucide-react";
import TablaLibros from "@/components/admin/TablaLibros";

export default async function AdminLibrosPage() {
  const supabase = createClient();
  const { data: libros } = await supabase.from("libros").select("*").order("fecha_creacion", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-deepblue">Libros</h1>
          <p className="text-muted text-sm">Gestiona todo el catálogo de la academia.</p>
        </div>
        <Link
          href="/admin/libros/nuevo"
          className="bg-electric text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo Libro
        </Link>
      </div>

      <TablaLibros libros={(libros as Libro[]) || []} />
    </div>
  );
}
