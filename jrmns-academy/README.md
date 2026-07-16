# JRMN'S Academy IA

Academia digital de Inteligencia Artificial. Next.js 14 (App Router) + TypeScript + Tailwind + Supabase.

## 1. Requisitos
- Node.js 18+
- Una cuenta gratuita en https://supabase.com

## 2. Crear el proyecto en Supabase
1. Crea un proyecto nuevo en Supabase.
2. Ve a **SQL Editor** → pega el contenido completo de `supabase/migrations/001_init.sql` → **Run**.
   Esto crea todas las tablas, triggers, RLS y los buckets de almacenamiento (`portadas`, `epubs`, `institucional`).
3. Ve a **Authentication → Providers → Google** y actívalo con tu Client ID / Secret de Google Cloud.
   - Redirect URL a autorizar en Google Cloud Console:
     `https://TU_PROYECTO.supabase.co/auth/v1/callback`
4. Ve a **Project Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (nunca exponer en el cliente)

## 3. Configurar variables de entorno
Copia `.env.example` a `.env.local` y completa los valores:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=Jrmnsdev@hotmail.com
```

El correo `Jrmnsdev@hotmail.com` queda reconocido automáticamente como administrador principal
(ver función `manejar_nuevo_usuario` en la migración SQL y el middleware en `src/middleware.ts`).
Para agregarlo manualmente si ya existe como usuario, ejecuta en el SQL Editor:

```sql
update usuarios set rol = 'admin' where correo = 'Jrmnsdev@hotmail.com';
```

## 4. Instalar y correr en local
```
npm install
npm run dev
```
Abre http://localhost:3000

## 5. Panel de Administración
Inicia sesión con Google usando el correo administrador y visita `/admin`.
Desde ahí puedes publicar libros (portada + EPUB), moderar reseñas, gestionar usuarios
y editar la configuración institucional (WhatsApp, correo, Facebook, colores) — todo sin tocar código.

## 6. Despliegue
Recomendado: Vercel.
1. Sube esta carpeta a un repositorio de GitHub.
2. Importa el repo en https://vercel.com/new
3. Agrega las mismas variables de entorno del paso 3 en el panel de Vercel.
4. Actualiza `NEXT_PUBLIC_SITE_URL` con tu dominio final y agrega la URL de callback de producción
   (`https://tu-dominio.com/auth/callback`) como Redirect URL autorizada en Supabase Auth.

## Estructura del proyecto
```
src/
  app/            → páginas (App Router): público + /admin
  components/     → componentes reutilizables (layout, home, libro, admin)
  lib/supabase/   → clientes de Supabase (browser, server, service role)
  lib/utils/      → slugify, link de WhatsApp, formateo de fechas
  types/          → tipos TypeScript compartidos
  middleware.ts   → protege /admin verificando rol de administrador
supabase/migrations/001_init.sql → esquema completo + RLS + triggers + buckets
```

## Flujo de publicación de un libro (< 2 minutos)
`/admin/libros/nuevo` → subir portada (PNG/JPG) y EPUB → completar título, descripción y precio →
elegir Gratuito/Premium → **Publicar**. El sistema sube los archivos a Supabase Storage, crea el
registro y actualiza automáticamente Biblioteca, Novedades, Carrusel y Búsqueda — sin recargar
ni tocar código.

## Flujo de compra Premium
El botón **Comprar** abre WhatsApp con un mensaje prellenado (título del libro + correo del
usuario) al número configurado en `/admin/configuracion`. No hay pasarela de pagos en esta versión,
tal como especifica el documento maestro.
