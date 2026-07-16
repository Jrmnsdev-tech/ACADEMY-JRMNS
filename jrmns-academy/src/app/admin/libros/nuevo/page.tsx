import FormularioLibro from "@/components/admin/FormularioLibro";

export default function NuevoLibroPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-deepblue mb-1">Nuevo Libro</h1>
      <p className="text-muted text-sm mb-8">Completa el formulario y publica en menos de dos minutos.</p>
      <FormularioLibro />
    </div>
  );
}
