import { createClient } from "@/lib/supabase/server";
import { BookOpen, Gift, Sparkles, Users, Heart, MessageSquareText, MessageCircleQuestion } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: totalLibros },
    { count: libresGratis },
    { count: librosPremium },
    { count: usuarios },
    { count: favoritos },
    { count: resenasPendientes },
    { count: solicitudes },
    { data: ultimoLibro },
  ] = await Promise.all([
    supabase.from("libros").select("*", { count: "exact", head: true }),
    supabase.from("libros").select("*", { count: "exact", head: true }).eq("tipo", "gratuito"),
    supabase.from("libros").select("*", { count: "exact", head: true }).eq("tipo", "premium"),
    supabase.from("usuarios").select("*", { count: "exact", head: true }),
    supabase.from("favoritos").select("*", { count: "exact", head: true }),
    supabase.from("resenas").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
    supabase.from("solicitudes_premium").select("*", { count: "exact", head: true }),
    supabase.from("libros").select("titulo").order("fecha_creacion", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const tarjetas = [
    { label: "Total de libros", valor: totalLibros ?? 0, icon: BookOpen },
    { label: "Libros gratuitos", valor: libresGratis ?? 0, icon: Gift },
    { label: "Libros Premium", valor: librosPremium ?? 0, icon: Sparkles },
    { label: "Usuarios registrados", valor: usuarios ?? 0, icon: Users },
    { label: "Favoritos recibidos", valor: favoritos ?? 0, icon: Heart },
    { label: "Reseñas pendientes", valor: resenasPendientes ?? 0, icon: MessageSquareText },
    { label: "Solicitudes Premium", valor: solicitudes ?? 0, icon: MessageCircleQuestion },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-deepblue mb-1">Dashboard</h1>
      <p className="text-muted text-sm mb-8">
        Último libro publicado: <strong>{ultimoLibro?.titulo || "—"}</strong>
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tarjetas.map((t) => (
          <div key={t.label} className="bg-white border border-line rounded-2xl p-5 shadow-card">
            <t.icon className="w-5 h-5 text-electric mb-3" />
            <div className="text-2xl font-extrabold text-deepblue">{t.valor}</div>
            <div className="text-xs text-muted mt-1">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
