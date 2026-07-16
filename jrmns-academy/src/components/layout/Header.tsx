"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Menu, X, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/premium", label: "Premium" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [abierto, setAbierto] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function entrarConGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function salir() {
    await supabase.auth.signOut();
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-deepblue text-lg tracking-tight">
          <BookOpen className="w-6 h-6 text-electric" strokeWidth={2.2} />
          JRMN'S <span className="text-electric">Academy IA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/80">
          {enlaces.map((e) => (
            <Link key={e.href} href={e.href} className="hover:text-electric transition-colors duration-250">
              {e.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.user_metadata?.avatar_url || "/avatar-default.svg"}
                alt={user.user_metadata?.full_name || "Usuario"}
                className="w-8 h-8 rounded-full border border-line"
              />
              <button
                onClick={salir}
                className="text-sm text-muted hover:text-electric flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Salir
              </button>
            </div>
          ) : (
            <button
              onClick={entrarConGoogle}
              className="bg-electric text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-250 shadow-glow"
            >
              Continuar con Google
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setAbierto(!abierto)}>
          {abierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {abierto && (
        <div className="md:hidden glass border-t border-line px-5 py-4 flex flex-col gap-4">
          {enlaces.map((e) => (
            <Link key={e.href} href={e.href} onClick={() => setAbierto(false)} className="text-ink/80 font-medium">
              {e.label}
            </Link>
          ))}
          {user ? (
            <button onClick={salir} className="text-left text-muted">Cerrar sesión</button>
          ) : (
            <button onClick={entrarConGoogle} className="bg-electric text-white font-semibold px-4 py-2 rounded-full">
              Continuar con Google
            </button>
          )}
        </div>
      )}
    </header>
  );
}
