import type { Libro } from "@/types";
import CardLibro from "@/components/libro/CardLibro";

export default function FilaLibros({
  titulo,
  subtitulo,
  libros,
}: {
  titulo: string;
  subtitulo?: string;
  libros: Libro[];
}) {
  if (!libros?.length) return null;
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-deepblue">{titulo}</h2>
        {subtitulo && <p className="text-sm text-muted mt-1">{subtitulo}</p>}
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-fina pb-3 -mx-1 px-1">
        {libros.map((libro) => (
          <div key={libro.id} className="w-[160px] sm:w-[200px]">
            <CardLibro libro={libro} />
          </div>
        ))}
      </div>
    </section>
  );
}
