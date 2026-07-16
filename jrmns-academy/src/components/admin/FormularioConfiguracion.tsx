"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Configuracion } from "@/types";
import { Loader2 } from "lucide-react";

export default function FormularioConfiguracion({ config }: { config: Configuracion }) {
  const supabase = createClient();
  const [form, setForm] = useState(config);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);

  async function guardar() {
    setGuardando(true);
    await supabase
      .from("configuracion")
      .update({
        nombre_academia: form.nombre_academia,
        whatsapp: form.whatsapp,
        correo: form.correo,
        facebook: form.facebook,
        color_principal: form.color_principal,
        color_secundario: form.color_secundario,
      })
      .eq("id", 1);
    setGuardando(false);
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  }

  const campo = (label: string, key: keyof Configuracion) => (
    <div>
      <label className="text-xs font-semibold text-muted mb-1 block">{label}</label>
      <input
        value={(form[key] as string) || ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:ring-2 focus:ring-electric/30"
      />
    </div>
  );

  return (
    <div className="max-w-xl bg-white border border-line rounded-2xl p-8 shadow-card space-y-4">
      {campo("Nombre de la Academia", "nombre_academia")}
      {campo("WhatsApp (con código de país)", "whatsapp")}
      {campo("Correo de contacto", "correo")}
      {campo("Página de Facebook", "facebook")}
      <div className="grid grid-cols-2 gap-4">
        {campo("Color principal", "color_principal")}
        {campo("Color secundario", "color_secundario")}
      </div>
      <button
        onClick={guardar}
        disabled={guardando}
        className="bg-electric text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        {guardando && <Loader2 className="w-4 h-4 animate-spin" />} Guardar cambios
      </button>
      {ok && <p className="text-sm text-green-600">Configuración actualizada.</p>}
    </div>
  );
}
