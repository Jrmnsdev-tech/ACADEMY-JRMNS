import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #0B1E3D 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-electric/10 blur-3xl -z-10" />
      <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full bg-cyan/10 blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-20 pb-16 text-center animate-fade-up">
        <span className="inline-flex items-center gap-1.5 bg-white border border-line rounded-full px-3.5 py-1.5 text-xs font-medium text-deepblue mb-6 shadow-card">
          <Sparkles className="w-3.5 h-3.5 text-electric" /> Biblioteca digital de Inteligencia Artificial
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-deepblue leading-[1.08]">
          Aprende Inteligencia Artificial<br className="hidden sm:block" /> a tu propio ritmo.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Libros digitales gratuitos y premium, organizados como una verdadera academia.
          Sin distracciones. Solo conocimiento.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/biblioteca"
            className="bg-electric text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors duration-250 shadow-glow"
          >
            Explorar Biblioteca <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/sobre-nosotros"
            className="bg-white border border-line text-deepblue font-semibold px-6 py-3 rounded-full hover:border-electric transition-colors duration-250"
          >
            Conocer la Academia
          </Link>
        </div>
      </div>
    </section>
  );
}
