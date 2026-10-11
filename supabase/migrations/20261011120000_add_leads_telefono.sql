-- Agrega el teléfono de contacto a los leads del formulario.
-- Nullable para no romper filas existentes; la web siempre lo envía (validado en src/lib/contact.ts).

alter table public.leads
  add column if not exists telefono text
  check (telefono is null or (char_length(telefono) <= 30 and telefono ~ '^\+?[0-9 ().-]+$'));

grant insert (telefono) on public.leads to anon;
