"use server";

import { headers } from "next/headers";
import { getSupabase } from "@/lib/supabase/server";
import { parseLead, type ContactState } from "@/lib/contact";

/** Server Action behind the contact form: validates and stores a lead in Supabase. */
export async function submitLead(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never see or fill this field.
  if (typeof formData.get("website") === "string" && formData.get("website") !== "") {
    return { status: "success" };
  }

  const parsed = parseLead(formData);
  if ("errors" in parsed) {
    return { status: "error", message: "Revisa los campos marcados.", errors: parsed.errors, values: parsed.values };
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[contact] SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY no configuradas");
    return {
      status: "error",
      message: "El formulario aún no está disponible. Escríbenos a informes@vertientelabs.com.",
      values: { ...parsed.lead, interes: parsed.lead.interes ?? "", mensaje: parsed.lead.mensaje ?? "" },
    };
  }

  const h = await headers();
  const { error } = await supabase.from("leads").insert({
    ...parsed.lead,
    origen: "web",
    user_agent: h.get("user-agent")?.slice(0, 400) ?? null,
  });

  if (error) {
    console.error("[contact] Error al guardar el lead:", error.message);
    return {
      status: "error",
      message: "No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.",
      values: { ...parsed.lead, interes: parsed.lead.interes ?? "", mensaje: parsed.lead.mensaje ?? "" },
    };
  }

  return { status: "success" };
}
