export function slugify(texto: string): string {
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function construirLinkWhatsApp(
  numero: string,
  titulo: string,
  correoUsuario?: string
): string {
  const numeroLimpio = numero.replace(/[^0-9]/g, "");
  let mensaje = `Hola. Me interesa comprar el libro "${titulo}".`;
  if (correoUsuario) {
    mensaje += ` Mi correo registrado es ${correoUsuario}.`;
  }
  mensaje += " ¿Podrías indicarme el método de pago?";
  return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function truncar(texto: string, max: number): string {
  return texto.length > max ? texto.slice(0, max).trimEnd() + "…" : texto;
}
