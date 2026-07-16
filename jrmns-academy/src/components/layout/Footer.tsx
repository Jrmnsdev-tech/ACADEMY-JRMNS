import Link from "next/link";
import { Facebook, Mail, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-deepblue text-lg mb-3">
            <BookOpen className="w-5 h-5 text-electric" />
            JRMN'S Academy IA
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Academia digital especializada en Inteligencia Artificial. Aprende con libros
            cuidadosamente desarrollados por JRMN'S.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-ink mb-3 text-sm">Enlaces</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/biblioteca" className="hover:text-electric">Biblioteca</Link></li>
            <li><Link href="/premium" className="hover:text-electric">Biblioteca Premium</Link></li>
            <li><Link href="/sobre-nosotros" className="hover:text-electric">Sobre la Academia</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-ink mb-3 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/contacto" className="hover:text-electric">Contacto</Link></li>
            <li className="opacity-70">Políticas de privacidad</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-ink mb-3 text-sm">Conecta</h4>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center hover:border-electric transition-colors">
              <Facebook className="w-4 h-4 text-deepblue" />
            </a>
            <a href="mailto:Jrmnsdev@hotmail.com" className="w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center hover:border-electric transition-colors">
              <Mail className="w-4 h-4 text-deepblue" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} JRMN'S Academy IA. Todos los derechos reservados.
      </div>
    </footer>
  );
}
