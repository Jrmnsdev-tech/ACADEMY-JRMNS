import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, Star, MessageCircle, Settings, LogOut, ArrowLeft } from "lucide-react";

const menu = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/libros", label: "Libros", icon: BookOpen },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/resenas", label: "Reseñas", icon: Star },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#0B1E3D]">
      <aside className="w-64 bg-[#0B1E3D] text-white/90 flex flex-col shrink-0">
        <div className="px-6 py-6 font-extrabold text-lg border-b border-white/10">
          JRMN'S <span className="text-cyan">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-5 border-t border-white/10 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" /> Volver al sitio
          </Link>
        </div>
      </aside>
      <div className="flex-1 bg-warmwhite rounded-l-[28px] min-h-screen">{children}</div>
    </div>
  );
}
