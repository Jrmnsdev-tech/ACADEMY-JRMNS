import { createClient } from "@/lib/supabase/server";
import type { Usuario } from "@/types";
import { formatearFecha } from "@/lib/utils";
import TablaUsuarios from "@/components/admin/TablaUsuarios";

export default async function AdminUsuariosPage() {
  const supabase = createClient();
  const { data: usuarios } = await supabase.from("usuarios").select("*").order("fecha_registro", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-deepblue mb-1">Usuarios</h1>
      <p className="text-muted text-sm mb-8">{usuarios?.length || 0} usuarios registrados.</p>
      <TablaUsuarios usuarios={(usuarios as Usuario[]) || []} />
    </div>
  );
}
