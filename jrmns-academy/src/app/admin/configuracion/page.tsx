import { createClient } from "@/lib/supabase/server";
import type { Configuracion } from "@/types";
import FormularioConfiguracion from "@/components/admin/FormularioConfiguracion";

export default async function AdminConfiguracionPage() {
  const supabase = createClient();
  const { data: config } = await supabase.from("configuracion").select("*").single<Configuracion>();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-deepblue mb-1">Configuración</h1>
      <p className="text-muted text-sm mb-8">Datos institucionales usados en toda la plataforma.</p>
      <FormularioConfiguracion config={config!} />
    </div>
  );
}
