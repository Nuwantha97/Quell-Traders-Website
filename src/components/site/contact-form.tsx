"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { formCopy } from "@/config/site";
import { pageCopy } from "@/data/site-content";
import { contactSchema, type ContactInput } from "@/data/contact-schema";

type SubmitState = { kind: "success" | "error"; message: string } | null;

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      interest: "TIJ Printing Solutions",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    setSubmitState(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setSubmitState({
          kind: "error",
          message: result.message ?? formCopy.error,
        });
        return;
      }

      reset();
      setSubmitState({
        kind: "success",
       message: result.message ?? formCopy.success,
      });
    } catch {
      setSubmitState({ kind: "error", message: formCopy.error });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-intro">
        <p className="eyebrow">{pageCopy.formIntro}</p>
        <h3>{formCopy.title}</h3>
        <p>{formCopy.description}</p>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span>{formCopy.labels.name} <b aria-hidden="true">*</b></span>
          <input autoComplete="name" placeholder={formCopy.placeholders.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
          {errors.name && <small id="name-error" className="field-error">{errors.name.message}</small>}
        </label>
        <label className="form-field">
          <span>{formCopy.labels.company}</span>
          <input autoComplete="organization" placeholder={formCopy.placeholders.company} aria-invalid={!!errors.company} {...register("company")} />
          {errors.company && <small className="field-error">{errors.company.message}</small>}
        </label>
        <label className="form-field">
          <span>{formCopy.labels.email} <b aria-hidden="true">*</b></span>
          <input type="email" autoComplete="email" placeholder={formCopy.placeholders.email} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
          {errors.email && <small id="email-error" className="field-error">{errors.email.message}</small>}
        </label>
        <label className="form-field">
          <span>{formCopy.labels.phone} <b aria-hidden="true">*</b></span>
          <input type="tel" autoComplete="tel" placeholder={formCopy.placeholders.phone} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} {...register("phone")} />
          {errors.phone && <small id="phone-error" className="field-error">{errors.phone.message}</small>}
        </label>
        <label className="form-field form-field--wide">
          <span>{formCopy.labels.interest} <b aria-hidden="true">*</b></span>
          <select aria-invalid={!!errors.interest} {...register("interest")}>
            {formCopy.interests.map((interest) => <option key={interest} value={interest}>{interest}</option>)}
          </select>
          {errors.interest && <small className="field-error">{errors.interest.message}</small>}
        </label>
        <label className="form-field form-field--wide">
          <span>{formCopy.labels.message} <b aria-hidden="true">*</b></span>
          <textarea rows={5} placeholder={formCopy.placeholders.message} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} {...register("message")} />
          {errors.message && <small id="message-error" className="field-error">{errors.message.message}</small>}
        </label>
        <label className="honeypot" aria-hidden="true" tabIndex={-1}>
          {pageCopy.honeypotLabel}
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      {submitState && (
        <p className={`form-status form-status--${submitState.kind}`} role={submitState.kind === "error" ? "alert" : "status"} aria-live="polite">
          {submitState.message}
        </p>
      )}

      <button className="button button--primary form-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? formCopy.sending : formCopy.submit}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-required-note">{formCopy.requiredNote}</p>
    </form>
  );
}
