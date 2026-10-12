-- "Producto con IA" pasa a "Integraciones con IA" en las opciones de interés.
-- Debe coincidir con INTERESES en src/lib/contact.ts.

alter table public.leads drop constraint if exists leads_interes_check;

update public.leads set interes = 'Integraciones con IA' where interes = 'Producto con IA';

alter table public.leads add constraint leads_interes_check check (interes is null or interes in (
  'LaborCare', 'Vertiente Reader', 'Software a la medida', 'Plataforma web',
  'App móvil', 'Integraciones con IA', 'Consultoría técnica', 'Aún no lo sé'));
