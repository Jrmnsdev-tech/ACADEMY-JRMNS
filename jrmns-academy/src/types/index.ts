export type TipoLibro = "gratuito" | "premium";
export type EstadoLibro = "borrador" | "publicado" | "oculto";
export type EstadoResena = "pendiente" | "aprobado" | "rechazado";
export type Rol = "usuario" | "admin";

export interface Libro {
  id: string;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  portada_url: string | null;
  epub_url: string | null;
  precio: number;
  tipo: TipoLibro;
  estado: EstadoLibro;
  fecha_creacion: string;
  fecha_publicacion: string | null;
  fecha_actualizacion: string;
  vistas: number;
  total_favoritos: number;
  valoracion_promedio: number;
  total_resenas: number;
}

export interface Usuario {
  id: string;
  auth_id: string;
  nombre: string;
  correo: string;
  foto_perfil: string | null;
  fecha_registro: string;
  ultimo_acceso: string;
  recibir_notificaciones: boolean;
  rol: Rol;
  estado: "activo" | "bloqueado";
}

export interface Resena {
  id: string;
  usuario_id: string;
  libro_id: string;
  calificacion: number;
  comentario: string | null;
  estado: EstadoResena;
  fecha: string;
  usuarios?: { nombre: string; foto_perfil: string | null };
}

export interface Configuracion {
  id: number;
  nombre_academia: string;
  whatsapp: string;
  correo: string;
  facebook: string;
  logo_url: string | null;
  favicon_url: string | null;
  color_principal: string;
  color_secundario: string;
}
