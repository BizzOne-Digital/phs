"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/lib/validations";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema) as never,
    defaultValues: {
      customerType: "homeowner",
      propertyType: "residential",
      serviceCategory: "general",
      isEmergency: false,
      consent: false as unknown as true,
      website: "",
    },
  });

  async function onSubmit(data: ContactInput | Record<string, unknown>) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setReference(json.referenceNumber);
      toast.success("Message sent successfully");
      reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="glass rounded-3xl p-5 text-center sm:p-8">
        <h3 className="font-display text-xl text-white sm:text-2xl">Thank you</h3>
        <p className="mt-3 text-slate-300">
          Your inquiry was received. Reference: <strong className="text-cyan-300">{reference}</strong>
        </p>
        <button type="button" className="btn-secondary mt-6" onClick={() => setReference(null)}>
          Send another message
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass space-y-4 rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-8">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("website")} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={label} htmlFor="fullName">Full name</label>
          <input id="fullName" className={field} {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-xs text-red-300">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" type="email" className={field} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="phone">Phone</label>
          <input id="phone" className={field} {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-red-300">{errors.phone.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="customerType">Customer type</label>
          <select id="customerType" className={field} {...register("customerType")}>
            <option value="homeowner">Homeowner</option>
            <option value="property_manager">Property manager</option>
            <option value="landlord">Landlord</option>
            <option value="realtor">Real estate professional</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="propertyType">Property type</label>
          <select id="propertyType" className={field} {...register("propertyType")}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="serviceCategory">Service category</label>
          <select id="serviceCategory" className={field} {...register("serviceCategory")}>
            <option value="electrical">Electrical</option>
            <option value="hvac">HVAC</option>
            <option value="plumbing">Plumbing</option>
            <option value="general">General inquiry</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="preferredDate">Preferred date</label>
          <input id="preferredDate" type="date" className={field} {...register("preferredDate")} />
        </div>
        <div>
          <label className={label} htmlFor="preferredTime">Preferred time</label>
          <input id="preferredTime" className={field} placeholder="Morning / Afternoon" {...register("preferredTime")} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="location">Address or general location</label>
        <input id="location" className={field} {...register("location")} />
        {errors.location && <p className="mt-1 text-xs text-red-300">{errors.location.message}</p>}
      </div>

      <div>
        <label className={label} htmlFor="message">Message</label>
        <textarea id="message" rows={5} className={field} {...register("message")} />
        {errors.message && <p className="mt-1 text-xs text-red-300">{errors.message.message}</p>}
      </div>

      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input type="checkbox" className="h-4 w-4" {...register("isEmergency")} />
        This is an emergency request
      </label>

      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input type="checkbox" className="mt-1 h-4 w-4" {...register("consent")} />
        I consent to be contacted about this inquiry.
      </label>
      {errors.consent && <p className="text-xs text-red-300">Consent is required</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto">
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
