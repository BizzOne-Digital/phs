"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Phone, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  { id: "electrical", label: "Electrical" },
  { id: "hvac", label: "HVAC" },
  { id: "plumbing", label: "Plumbing" },
] as const;

const SERVICES: Record<string, string[]> = {
  electrical: [
    "Emergency electrical troubleshooting",
    "Panel / breaker issues",
    "Outlet or switch repair",
    "Lighting installation",
    "Wiring / rewiring",
    "Electrical inspection / maintenance",
  ],
  hvac: [
    "No heat / no cooling emergency",
    "HVAC diagnostics",
    "Repair",
    "Maintenance",
    "Thermostat service",
    "Installation support",
  ],
  plumbing: [
    "Burst pipe / major leak emergency",
    "Drain issues",
    "Fixture installation",
    "Pipe repair",
    "Leak repair",
    "Plumbing maintenance",
  ],
};

type FormState = {
  serviceCategory: "electrical" | "hvac" | "plumbing" | "";
  isEmergency: boolean | null;
  specificService: string;
  propertyType: "residential" | "commercial";
  issueDetails: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  fullName: string;
  email: string;
  phone: string;
  customerType: string;
  imageUrls: string[];
  consent: boolean;
};

const initial: FormState = {
  serviceCategory: "",
  isEmergency: null,
  specificService: "",
  propertyType: "residential",
  issueDetails: "",
  location: "",
  preferredDate: "",
  preferredTime: "",
  fullName: "",
  email: "",
  phone: "",
  customerType: "homeowner",
  imageUrls: [],
  consent: false,
};

export function ServiceRequestWizard({
  emergencyPhone = "437-256-1028",
  initialCategory,
}: {
  emergencyPhone?: string;
  initialCategory?: "electrical" | "hvac" | "plumbing";
}) {
  const [step, setStep] = useState(initialCategory ? 2 : 1);
  const [form, setForm] = useState<FormState>({
    ...initial,
    serviceCategory: initialCategory || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const serviceOptions = useMemo(
    () => (form.serviceCategory ? SERVICES[form.serviceCategory] : []),
    [form.serviceCategory]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (step === 1 && !form.serviceCategory) return toast.error("Select a service category");
    if (step === 2 && form.isEmergency === null) return toast.error("Select emergency or scheduled");
    if (step === 3 && !form.specificService) return toast.error("Choose a specific service");
    if (step === 4 && (form.issueDetails.length < 10 || form.location.length < 2)) {
      return toast.error("Add issue details and location");
    }
    if (step === 5) {
      if (form.fullName.length < 2 || !form.email.includes("@") || form.phone.length < 10 || !form.consent) {
        return toast.error("Complete contact details and consent");
      }
    }
    setStep((s) => Math.min(6, s + 1));
  }

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: "",
          consent: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setReference(json.referenceNumber);
      toast.success("Request submitted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to submit");
    } finally {
      setSubmitting(false);
    }
  }

  async function onFileChange(files: FileList | null) {
    if (!files?.length) return;
    const uploads: string[] = [];
    for (const file of Array.from(files).slice(0, 3)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        continue;
      }
      const reader = new FileReader();
      const dataUri = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      try {
        const res = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUri, alt: "Service request photo", folder: "vnec/leads" }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.url) uploads.push(json.url);
        } else {
          // Public upload may require auth — keep local preview data URI out of DB if blocked
          toast.message("Image upload requires admin media config; continuing without photo.");
        }
      } catch {
        toast.message("Could not upload image; continuing without it.");
      }
    }
    if (uploads.length) update("imageUrls", [...form.imageUrls, ...uploads]);
  }

  if (reference) {
    return (
      <div className="glass mx-auto max-w-2xl rounded-3xl p-5 text-center sm:p-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
        <h2 className="mt-4 font-display text-2xl text-white sm:text-3xl">Request received</h2>
        <p className="mt-3 text-slate-300">
          Reference number: <span className="font-semibold text-cyan-300">{reference}</span>
        </p>
        {form.isEmergency ? (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            For immediate danger (fire, gas, carbon monoxide), leave the property and contact emergency services first.
            For urgent trade emergencies, call us now:
            <a href={`tel:${emergencyPhone.replace(/\D/g, "")}`} className="mt-3 btn-emergency inline-flex">
              <Phone className="h-4 w-4" /> {emergencyPhone}
            </a>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">Our team will contact you during business hours.</p>
        )}
      </div>
    );
  }

  const card = "glass cursor-pointer rounded-2xl border border-transparent p-5 transition hover:border-cyan-400/40";
  const active = "border-cyan-400/50 bg-cyan-400/10";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-cyan-400" : "bg-white/10"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Select a category</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${card} ${form.serviceCategory === c.id ? active : ""}`}
                onClick={() => update("serviceCategory", c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Emergency or scheduled?</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <button type="button" className={`${card} ${form.isEmergency === true ? active : ""}`} onClick={() => update("isEmergency", true)}>
              24/7 Emergency
            </button>
            <button type="button" className={`${card} ${form.isEmergency === false ? active : ""}`} onClick={() => update("isEmergency", false)}>
              Scheduled service
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Choose the specific service</h2>
          <div className="grid gap-3">
            {serviceOptions.map((s) => (
              <button key={s} type="button" className={`${card} text-left ${form.specificService === s ? active : ""}`} onClick={() => update("specificService", s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Property & issue details</h2>
          <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" value={form.propertyType} onChange={(e) => update("propertyType", e.target.value as "residential" | "commercial")}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
          <textarea className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" rows={5} placeholder="Describe the issue" value={form.issueDetails} onChange={(e) => update("issueDetails", e.target.value)} />
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Address or general GTA location" value={form.location} onChange={(e) => update("location", e.target.value)} />
          <div className="grid gap-3 md:grid-cols-2">
            <input type="date" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
            <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Preferred time" value={form.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">Optional photos</label>
            <input type="file" accept="image/*" multiple onChange={(e) => onFileChange(e.target.files)} />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Contact details</h2>
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" value={form.customerType} onChange={(e) => update("customerType", e.target.value)}>
            <option value="homeowner">Homeowner</option>
            <option value="property_manager">Property manager</option>
            <option value="landlord">Landlord</option>
            <option value="realtor">Real estate professional</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>
          <label className="flex items-start gap-3 text-sm text-slate-300">
            <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1" />
            I consent to be contacted about this service request.
          </label>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Review & submit</h2>
          <div className="glass space-y-2 rounded-2xl p-5 text-sm text-slate-300">
            <p><strong className="text-white">Category:</strong> {form.serviceCategory}</p>
            <p><strong className="text-white">Type:</strong> {form.isEmergency ? "Emergency" : "Scheduled"}</p>
            <p><strong className="text-white">Service:</strong> {form.specificService}</p>
            <p><strong className="text-white">Location:</strong> {form.location}</p>
            <p><strong className="text-white">Contact:</strong> {form.fullName} · {form.phone}</p>
            <p><strong className="text-white">Details:</strong> {form.issueDetails}</p>
          </div>
        </div>
      )}

      <div className="btn-stack mt-8 justify-between sm:flex-row">
        <button type="button" className="btn-secondary order-2 sm:order-1" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
          Back
        </button>
        {step < 6 ? (
          <button type="button" className="btn-primary order-1 sm:order-2" onClick={next}>Continue</button>
        ) : (
          <button type="button" className="btn-primary order-1 sm:order-2" disabled={submitting} onClick={submit}>
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        )}
      </div>
    </div>
  );
}
