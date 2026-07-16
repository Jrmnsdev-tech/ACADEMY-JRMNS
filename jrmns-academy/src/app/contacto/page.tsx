import { createClient } from "@/lib/supabase/server";
import { Facebook, Mail } from "lucide-react";
import type { Configuracion } from "@/types";

export const metadata = { title: "Contacto — JRMN'S Academy IA" };

export default async function ContactoPage() {
  const supabase = createClient();
  const { data: config } = await supabase.from("configuracion").select("*").single<Configuracion>();

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-deepblue mb-3">Contacto</h1>
      <p className="text-muted mb-10">¿Tienes dudas o quieres saber más de JRMN'S Academy IA? Escríbenos.</p>

      <div className="flex flex-col gap-4 mb-10">
        <a href={`mailto:${config?.correo}`} className="flex items-center gap-3 bg-white border border-line rounded-xl p-4 hover:border-electric transition-colors">
          <Mail className="w-5 h-5 text-electric" />
          <span className="text-sm font-medium text-ink">{config?.correo}</span>
        </a>
        <a href={config?.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white border border-line rounded-xl p-4 hover:border-electric transition-colors">
          <Facebook className="w-5 h-5 text-electric" />
          <span className="text-sm font-medium text-ink">JRMN'S Academy IA en Facebook</span>
        </a>
      </div>

      <form className="bg-paper border border-line rounded-2xl p-6 space-y-4">
        <input placeholder="Tu nombre" className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:ring-2 focus:ring-electric/30" />
        <input placeholder="Tu correo" className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:ring-2 focus:ring-electric/30" />
        <textarea placeholder="Tu mensaje" rows={4} className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:ring-2 focus:ring-electric/30" />
        <button type="button" className="bg-electric text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}
