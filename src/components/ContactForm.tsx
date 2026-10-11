"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/actions/contact";
import { INTERESES, LIMITS, SECTORES, type ContactState, type LeadField } from "@/lib/contact";

const initialState: ContactState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  if (state.status === "success") {
    return (
      <div className="lead lead--done glass" role="status">
        <span className="lead__check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h3>
          Solicitud <em>recibida.</em>
        </h3>
        <p>Gracias. Nuestro equipo te contactará en menos de 48 horas hábiles con próximos pasos claros.</p>
      </div>
    );
  }

  const err = (f: LeadField) => state.errors?.[f];
  const val = (f: LeadField) => state.values?.[f] ?? "";
  // Re-mount the fields after a failed submit so they show the values that were sent.
  const formKey = state.values ? JSON.stringify(state.values) : "initial";

  const field = (f: LeadField) => ({
    id: `lead-${f}`,
    name: f,
    defaultValue: val(f),
    "aria-invalid": err(f) ? true : undefined,
    "aria-describedby": err(f) ? `lead-${f}-error` : undefined,
  });

  const errorText = (f: LeadField) =>
    err(f) ? (
      <span className="lead__error" id={`lead-${f}-error`}>
        {err(f)}
      </span>
    ) : null;

  return (
    <form key={formKey} action={formAction} className="lead glass" noValidate>
      <div className="lead__grid">
        <label className="lead__field">
          <span className="lead__label">Nombre</span>
          <input {...field("nombre")} type="text" placeholder="Tu nombre" autoComplete="name" maxLength={LIMITS.nombre} required />
          {errorText("nombre")}
        </label>
        <label className="lead__field">
          <span className="lead__label">Empresa</span>
          <input {...field("empresa")} type="text" placeholder="Organización" autoComplete="organization" maxLength={LIMITS.empresa} required />
          {errorText("empresa")}
        </label>
        <label className="lead__field">
          <span className="lead__label">Email corporativo</span>
          <input {...field("email")} type="email" placeholder="nombre@empresa.com" autoComplete="email" maxLength={LIMITS.email} required />
          {errorText("email")}
        </label>
        <label className="lead__field">
          <span className="lead__label">Sector</span>
          <select {...field("sector")} required>
            <option value="" disabled>
              Selecciona…
            </option>
            {SECTORES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {errorText("sector")}
        </label>
        <label className="lead__field lead__field--full">
          <span className="lead__label">
            ¿Qué te interesa? <small>Opcional</small>
          </span>
          <select {...field("interes")}>
            <option value="">Elige un producto o servicio…</option>
            {INTERESES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {errorText("interes")}
        </label>
        <label className="lead__field lead__field--full">
          <span className="lead__label">
            Cuéntanos tu reto <small>Opcional</small>
          </span>
          <textarea {...field("mensaje")} rows={4} placeholder="¿Qué proceso u operación quieres mejorar?" maxLength={LIMITS.mensaje} />
          {errorText("mensaje")}
        </label>
      </div>

      {/* Honeypot for bots: hidden from people and assistive tech */}
      <div className="lead__hp" aria-hidden="true">
        <label>
          Sitio web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="lead__foot">
        <p className="lead__note">Respetamos tu privacidad. Usaremos tus datos solo para contactarte.</p>
        <button type="submit" className="btn btn--chalk" disabled={pending}>
          {pending ? "Enviando…" : "Enviar solicitud"} <span aria-hidden="true">→</span>
        </button>
      </div>
      <p className="lead__status" aria-live="polite">
        {state.status === "error" && state.message}
      </p>
    </form>
  );
}
