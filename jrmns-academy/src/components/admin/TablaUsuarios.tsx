"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Usuario } from "@/types";
import { formatearFecha } from "@/lib/utils";
import { Lock, Unlock } from "lucide-react";

export default function TablaUsuarios({ usuarios: inicial }: { usuarios: Usuario[] }) {
  const [usuarios, setUsuarios] = useState(inicial);
  const supabase = createClient();

  async function alternarBloqueo(u: Usuario) {
    const nuevo = u.estado === "activo" ? "bloqueado" : "activo";
    await supabase.from("usuarios").update({ estado: nuevo }).eq("id", u.id);
    setUsuarios((prev) => prev.map((x) => (x.id === u.id ? { ...x, estado: nuevo } : x)));
  }

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-card">
      <table className="w-full text-sm">
        <thead className="bg-paper text-muted text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-5 py-3 font-medium">Usuario</th>
            <th className="text-left px-5 py-3 font-medium">Correo</th>
            <th className="text-left px-5 py-3 font-medium">Registro</th>
            <th className="text-left px-5 py-3 font-medium">Estado</th>
            <th className="text-right px-5 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-t border-line/60 hover:bg-paper/60">
              <td className="px-5 py-3 flex items-center gap-3 font-medium text-ink">
                <img src={u.foto_perfil || "/avatar-default.svg"} className="w-7 h-7 rounded-full border border-line" alt="" />
                {u.nombre} {u.rol === "admin" && <span className="text-[10px] bg-deepblue text-white px-1.5 py-0.5 rounded-full">Admin</span>}
              </td>
              <td className="px-5 py-3 text-muted">{u.correo}</td>
              <td className="px-5 py-3 text-muted">{formatearFecha(u.fecha_registro)}</td>
              <td className="px-5 py-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${u.estado === "activo" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {u.estado}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                {u.rol !== "admin" && (
                  <button onClick={() => alternarBloqueo(u)} className="p-2 rounded-lg hover:bg-paper text-muted hover:text-electric">
                    {u.estado === "activo" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
