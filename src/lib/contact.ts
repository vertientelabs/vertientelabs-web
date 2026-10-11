// Contact form: options and validation shared by the form (client) and the
// Server Action. Keep option values in sync with the CHECK constraints in
// supabase/migrations/*_create_leads.sql.

export const SECTORES = [
  "Industria / Manufactura",
  "Minería",
  "Energía y servicios básicos",
  "Construcción / Ingeniería",
  "Inmobiliaria / Condominios",
  "Logística",
  "Salud",
  "Otro",
] as const;

export const INTERESES = [
  "LaborCare",
  "Vertiente Reader",
  "Software a la medida",
  "Plataforma web",
  "App móvil",
  "Producto con IA",
  "Consultoría técnica",
  "Aún no lo sé",
] as const;

export const LIMITS = { nombre: 120, empresa: 160, email: 254, mensaje: 4000 } as const;

export type Lead = {
  nombre: string;
  empresa: string;
  email: string;
  sector: string;
  interes: string | null;
  mensaje: string | null;
};

export type LeadField = keyof Lead;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<LeadField, string>>;
  values?: Partial<Record<LeadField, string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
};

/** Reads and validates the form. Returns either a clean lead or field errors. */
export function parseLead(fd: FormData): { lead: Lead } | { errors: Partial<Record<LeadField, string>>; values: Partial<Record<LeadField, string>> } {
  const values = {
    nombre: text(fd, "nombre"),
    empresa: text(fd, "empresa"),
    email: text(fd, "email").toLowerCase(),
    sector: text(fd, "sector"),
    interes: text(fd, "interes"),
    mensaje: text(fd, "mensaje"),
  };
  const errors: Partial<Record<LeadField, string>> = {};

  if (values.nombre.length < 2) errors.nombre = "Escribe tu nombre.";
  else if (values.nombre.length > LIMITS.nombre) errors.nombre = "El nombre es demasiado largo.";

  if (values.empresa.length < 2) errors.empresa = "Escribe el nombre de tu organización.";
  else if (values.empresa.length > LIMITS.empresa) errors.empresa = "El nombre es demasiado largo.";

  if (!EMAIL.test(values.email) || values.email.length > LIMITS.email) errors.email = "Revisa el formato del correo.";

  if (!(SECTORES as readonly string[]).includes(values.sector)) errors.sector = "Selecciona un sector.";

  if (values.interes && !(INTERESES as readonly string[]).includes(values.interes)) errors.interes = "Selecciona una opción de la lista.";

  if (values.mensaje.length > LIMITS.mensaje) errors.mensaje = `Máximo ${LIMITS.mensaje} caracteres.`;

  if (Object.keys(errors).length) return { errors, values };
  return {
    lead: {
      nombre: values.nombre,
      empresa: values.empresa,
      email: values.email,
      sector: values.sector,
      interes: values.interes || null,
      mensaje: values.mensaje || null,
    },
  };
}
