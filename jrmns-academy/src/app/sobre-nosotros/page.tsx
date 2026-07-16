export const metadata = { title: "Sobre la Academia — JRMN'S Academy IA" };

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-deepblue mb-6">Sobre JRMN'S Academy IA</h1>
      <div className="prose prose-neutral max-w-none text-ink/80 leading-relaxed space-y-5 text-[15px]">
        <p>
          JRMN'S Academy IA es una academia digital especializada en Inteligencia Artificial,
          creada para que cualquier persona pueda aprender de forma clara, organizada y profesional.
        </p>
        <p>
          Nuestra biblioteca reúne libros gratuitos y premium desarrollados por JRMN'S, pensados
          para estudiantes, profesionales, emprendedores y curiosos de la tecnología.
        </p>
        <p>
          <strong className="text-deepblue">Misión.</strong> Democratizar el acceso al conocimiento
          sobre Inteligencia Artificial en español.
        </p>
        <p>
          <strong className="text-deepblue">Visión.</strong> Convertirnos en la biblioteca digital de
          referencia en IA para el mundo hispanohablante.
        </p>
        <p>
          <strong className="text-deepblue">Compromiso.</strong> Contenido de calidad, una experiencia
          de lectura impecable y una comunidad que crece aprendiendo junta.
        </p>
      </div>
    </div>
  );
}
