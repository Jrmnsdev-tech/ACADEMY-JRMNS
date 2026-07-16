-- ============================================================
-- JRMN'S ACADEMY IA — ESQUEMA BASE (Supabase / PostgreSQL)
-- ============================================================
create extension if not exists "uuid-ossp";

-- ---------- USUARIOS ----------
create table if not exists usuarios (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid unique references auth.users(id) on delete cascade,
  nombre text not null,
  correo text unique not null,
  foto_perfil text,
  fecha_registro timestamptz default now(),
  ultimo_acceso timestamptz default now(),
  recibir_notificaciones boolean default false,
  rol text not null default 'usuario' check (rol in ('usuario','admin')),
  estado text not null default 'activo' check (estado in ('activo','bloqueado'))
);

-- ---------- LIBROS ----------
create table if not exists libros (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null check (char_length(titulo) <= 120),
  slug text unique not null,
  descripcion_corta text check (char_length(descripcion_corta) <= 300),
  portada_url text,
  epub_url text,
  precio numeric(10,2) not null default 0,
  tipo text not null check (tipo in ('gratuito','premium')),
  estado text not null default 'borrador' check (estado in ('borrador','publicado','oculto')),
  fecha_creacion timestamptz default now(),
  fecha_publicacion timestamptz,
  fecha_actualizacion timestamptz default now(),
  vistas integer default 0,
  total_favoritos integer default 0,
  valoracion_promedio numeric(3,2) default 0,
  total_resenas integer default 0
);
create index if not exists idx_libros_estado on libros(estado);
create index if not exists idx_libros_tipo on libros(tipo);

-- ---------- FAVORITOS ----------
create table if not exists favoritos (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references usuarios(id) on delete cascade,
  libro_id uuid references libros(id) on delete cascade,
  fecha timestamptz default now(),
  unique(usuario_id, libro_id)
);

-- ---------- RESEÑAS ----------
create table if not exists resenas (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references usuarios(id) on delete cascade,
  libro_id uuid references libros(id) on delete cascade,
  calificacion integer not null check (calificacion between 1 and 5),
  comentario text,
  estado text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado')),
  fecha timestamptz default now(),
  unique(usuario_id, libro_id)
);

-- ---------- SOLICITUDES PREMIUM ----------
create table if not exists solicitudes_premium (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references usuarios(id) on delete set null,
  libro_id uuid references libros(id) on delete cascade,
  fecha timestamptz default now(),
  estado text not null default 'pendiente' check (estado in ('pendiente','contactado','cerrado'))
);

-- ---------- CONFIGURACION (fila única) ----------
create table if not exists configuracion (
  id int primary key default 1,
  nombre_academia text default "JRMN'S Academy IA",
  whatsapp text default '+56921876526',
  correo text default 'Jrmnsdev@hotmail.com',
  facebook text default 'https://facebook.com/jrmnsacademyia',
  logo_url text,
  favicon_url text,
  color_principal text default '#2563EB',
  color_secundario text default '#0B1E3D',
  constraint solo_una_fila check (id = 1)
);
insert into configuracion (id) values (1) on conflict (id) do nothing;

-- ---------- PREGUNTAS DE LA COMUNIDAD ----------
create table if not exists sugerencias_comunidad (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references usuarios(id) on delete cascade,
  contenido text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado')),
  fecha timestamptz default now()
);

-- ---------- PROGRESO DE LECTURA ----------
create table if not exists progreso_lectura (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references usuarios(id) on delete cascade,
  libro_id uuid references libros(id) on delete cascade,
  porcentaje numeric(5,2) default 0,
  ubicacion_cfi text,
  actualizado_en timestamptz default now(),
  unique(usuario_id, libro_id)
);

-- ============================================================
-- FUNCIONES DE AGREGACIÓN AUTOMÁTICA
-- ============================================================
create or replace function actualizar_stats_libro() returns trigger as $$
begin
  update libros set
    total_favoritos = (select count(*) from favoritos where libro_id = coalesce(new.libro_id, old.libro_id)),
    fecha_actualizacion = now()
  where id = coalesce(new.libro_id, old.libro_id);
  return null;
end; $$ language plpgsql;

drop trigger if exists trg_favoritos on favoritos;
create trigger trg_favoritos after insert or delete on favoritos
for each row execute function actualizar_stats_libro();

create or replace function actualizar_stats_resena() returns trigger as $$
begin
  update libros set
    total_resenas = (select count(*) from resenas where libro_id = coalesce(new.libro_id, old.libro_id) and estado='aprobado'),
    valoracion_promedio = coalesce((select round(avg(calificacion)::numeric,2) from resenas where libro_id = coalesce(new.libro_id, old.libro_id) and estado='aprobado'),0),
    fecha_actualizacion = now()
  where id = coalesce(new.libro_id, old.libro_id);
  return null;
end; $$ language plpgsql;

drop trigger if exists trg_resenas on resenas;
create trigger trg_resenas after insert or update or delete on resenas
for each row execute function actualizar_stats_resena();

-- Crear fila en 'usuarios' automáticamente al registrarse con Google
create or replace function manejar_nuevo_usuario() returns trigger as $$
begin
  insert into usuarios (auth_id, nombre, correo, foto_perfil, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    case when lower(new.email) = lower(current_setting('app.admin_email', true)) then 'admin' else 'usuario' end
  )
  on conflict (correo) do nothing;
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists trg_nuevo_usuario on auth.users;
create trigger trg_nuevo_usuario after insert on auth.users
for each row execute function manejar_nuevo_usuario();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table usuarios enable row level security;
alter table libros enable row level security;
alter table favoritos enable row level security;
alter table resenas enable row level security;
alter table solicitudes_premium enable row level security;
alter table configuracion enable row level security;
alter table sugerencias_comunidad enable row level security;
alter table progreso_lectura enable row level security;

create or replace function es_admin() returns boolean as $$
  select exists (
    select 1 from usuarios where auth_id = auth.uid() and rol = 'admin'
  );
$$ language sql stable security definer;

-- USUARIOS: cada quien ve/edita lo suyo; admin ve todo
create policy "usuarios_select_propio_o_admin" on usuarios for select
  using (auth_id = auth.uid() or es_admin());
create policy "usuarios_update_propio_o_admin" on usuarios for update
  using (auth_id = auth.uid() or es_admin());

-- LIBROS: público ve publicados; admin ve/edita todo
create policy "libros_select_publico" on libros for select
  using (estado = 'publicado' or es_admin());
create policy "libros_admin_insert" on libros for insert with check (es_admin());
create policy "libros_admin_update" on libros for update using (es_admin());
create policy "libros_admin_delete" on libros for delete using (es_admin());

-- FAVORITOS: cada usuario gestiona los suyos
create policy "favoritos_select" on favoritos for select
  using (usuario_id in (select id from usuarios where auth_id = auth.uid()) or es_admin());
create policy "favoritos_insert" on favoritos for insert
  with check (usuario_id in (select id from usuarios where auth_id = auth.uid()));
create policy "favoritos_delete" on favoritos for delete
  using (usuario_id in (select id from usuarios where auth_id = auth.uid()));

-- RESEÑAS: lectura pública de aprobadas; usuario crea/edita las suyas; admin todo
create policy "resenas_select_publico" on resenas for select
  using (estado = 'aprobado' or usuario_id in (select id from usuarios where auth_id = auth.uid()) or es_admin());
create policy "resenas_insert" on resenas for insert
  with check (usuario_id in (select id from usuarios where auth_id = auth.uid()));
create policy "resenas_update" on resenas for update
  using (usuario_id in (select id from usuarios where auth_id = auth.uid()) or es_admin());
create policy "resenas_delete" on resenas for delete
  using (usuario_id in (select id from usuarios where auth_id = auth.uid()) or es_admin());

-- SOLICITUDES PREMIUM
create policy "solicitudes_insert" on solicitudes_premium for insert with check (true);
create policy "solicitudes_select_admin" on solicitudes_premium for select using (es_admin());

-- CONFIGURACION: lectura pública, solo admin edita
create policy "configuracion_select_publico" on configuracion for select using (true);
create policy "configuracion_admin_update" on configuracion for update using (es_admin());

-- SUGERENCIAS
create policy "sugerencias_select" on sugerencias_comunidad for select
  using (estado = 'aprobado' or es_admin() or usuario_id in (select id from usuarios where auth_id = auth.uid()));
create policy "sugerencias_insert" on sugerencias_comunidad for insert
  with check (usuario_id in (select id from usuarios where auth_id = auth.uid()));
create policy "sugerencias_admin_update" on sugerencias_comunidad for update using (es_admin());

-- PROGRESO LECTURA: privado por usuario
create policy "progreso_select" on progreso_lectura for select
  using (usuario_id in (select id from usuarios where auth_id = auth.uid()));
create policy "progreso_upsert" on progreso_lectura for insert
  with check (usuario_id in (select id from usuarios where auth_id = auth.uid()));
create policy "progreso_update" on progreso_lectura for update
  using (usuario_id in (select id from usuarios where auth_id = auth.uid()));

-- ============================================================
-- STORAGE BUCKETS (ejecutar una vez; o crear desde el Dashboard)
-- ============================================================
insert into storage.buckets (id, name, public) values ('portadas','portadas', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('epubs','epubs', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('institucional','institucional', true) on conflict do nothing;

create policy "portadas_lectura_publica" on storage.objects for select using (bucket_id = 'portadas');
create policy "epubs_lectura_publica" on storage.objects for select using (bucket_id = 'epubs');
create policy "institucional_lectura_publica" on storage.objects for select using (bucket_id = 'institucional');
create policy "admin_sube_portadas" on storage.objects for insert with check (bucket_id = 'portadas' and es_admin());
create policy "admin_sube_epubs" on storage.objects for insert with check (bucket_id = 'epubs' and es_admin());
create policy "admin_sube_institucional" on storage.objects for insert with check (bucket_id = 'institucional' and es_admin());
create policy "admin_actualiza_storage" on storage.objects for update using (es_admin());
create policy "admin_borra_storage" on storage.objects for delete using (es_admin());
