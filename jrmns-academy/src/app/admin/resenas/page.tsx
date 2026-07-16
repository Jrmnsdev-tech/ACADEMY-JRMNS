import { createClient } from "@/lib/supabase/server";
import type { Resena } from "@/types";
import ModeracionResenas from "@/components/admin/ModeracionResenas";

export default async function AdminResenasPage() {
  const supabase = createClient();
  const { data: resenas } = await supabase
    .from("resenas")
    .select("*, usuarios(nombre, foto_perfil), libros(titulo)")
    .order("fecha", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-deepblue mb-1">Reseñas</h1>
      <p className="text-muted text-sm mb-8">Modera antes de que se publiquen.</p>
      <ModeracionResenas resenas={(resenas as any[]) || []} />
    </div>
  );
}
