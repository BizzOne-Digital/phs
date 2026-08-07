"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Phone, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "electrical", label: "Electrical" },
  { id: "hvac", label: "HVAC" },
  { id: "plumbing", label: "Plumbing" },
] as const;

const STEPS = [
  { n: 1, label: "Category" },
  { n: 2, label: "Urgency" },
  { n: 3, label: "Service" },
  { n: 4, label: "Details" },
  { n: 5, label: "Contact" },
  { n: 6, label: "Review" },
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
  const [maxReached, setMaxReached] = useState(initialCategory ? 2 : 1);
  const [form, setForm] = useState<FormState>({
    ...initial,
    serviceCategory: initialCategory || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    businessOk?: boolean;
    customerOk?: boolean;
    error?: string;
  } | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  const serviceOptions = useMemo(
    () => (form.serviceCategory ? SERVICES[form.serviceCategory] : []),
    [form.serviceCategory]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setStepError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(s: number, showToast = true): boolean {
    const fail = (msg: string) => {
      setStepError(msg);
      if (showToast) toast.error(msg);
      return false;
    };
    if (s === 1 && !form.serviceCategory) return fail("Select a service category");
    if (s === 2 && form.isEmergency === null) return fail("Select emergency or scheduled");
    if (s === 3 && !form.specificService) return fail("Choose a specific service");
    if (s === 4) {
      const details = form.issueDetails.trim();
      const loc = form.location.trim();
      if (details.length < 5) {
        return fail("Please describe the issue (at least 5 characters)");
      }
      if (loc.length < 2) {
        return fail("Please enter an address or general GTA location");
      }
    }
    if (s === 5) {
      if (form.fullName.trim().length < 2) return fail("Enter your full name");
      if (!form.email.includes("@") || !form.email.includes(".")) {
        return fail("Enter a valid email address");
      }
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 10) return fail("Enter a valid phone number (10+ digits)");
      if (!form.consent) return fail("Please check the consent box to continue");
    }
    setStepError(null);
    return true;
  }

  function goToStep(target: number) {
    if (target === step) return;
    if (target < 1 || target > 6) return;

    // Always allow going back to a visited step
    if (target < step && target <= maxReached) {
      setStep(target);
      return;
    }

    // Jump forward only through steps already reached
    if (target <= maxReached) {
      setStep(target);
      return;
    }

    // Advance one step at a time when current step is valid
    if (target === step + 1 && validateStep(step)) {
      setStep(target);
      setMaxReached((m) => Math.max(m, target));
      return;
    }

    toast.error("Complete this step before continuing");
  }

  function isStepComplete(s: number): boolean {
    if (s === 1) return Boolean(form.serviceCategory);
    if (s === 2) return form.isEmergency !== null;
    if (s === 3) return Boolean(form.specificService);
    if (s === 4) {
      return form.issueDetails.trim().length >= 5 && form.location.trim().length >= 2;
    }
    if (s === 5) {
      const digits = form.phone.replace(/\D/g, "");
      return (
        form.fullName.trim().length >= 2 &&
        form.email.includes("@") &&
        form.email.includes(".") &&
        digits.length >= 10 &&
        form.consent
      );
    }
    if (s === 6) return true;
    return false;
  }

  const canContinue = isStepComplete(step);

  function next() {
    if (!validateStep(step)) return;
    const target = Math.min(6, step + 1);
    setStep(target);
    setMaxReached((m) => Math.max(m, target));
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
      const businessOk = Boolean(json.email?.business?.ok);
      const customerOk = Boolean(json.email?.customer?.ok);
      setEmailStatus({
        businessOk,
        customerOk,
        error: json.email?.business?.error || json.email?.customer?.error,
      });
      if (businessOk && customerOk) {
        toast.success("Request submitted — confirmation email sent");
      } else if (customerOk) {
        toast.success("Request submitted");
      } else {
        toast.success("Request submitted");
        toast.message("Confirmation email could not be sent. We’ll still contact you.");
      }
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
          body: JSON.stringify({ dataUri, alt: "Service request photo", folder: "phs/leads" }),
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
        {emailStatus && (!emailStatus.customerOk || !emailStatus.businessOk) ? (
          <p className="mt-4 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
            Your request was saved successfully
            {!emailStatus.customerOk
              ? ", but the confirmation email could not be delivered right now"
              : ""}
            . Our team still has your request
            {emailStatus.error ? ` (${emailStatus.error.slice(0, 120)})` : ""}.
          </p>
        ) : null}
      </div>
    );
  }

  function selectAndAdvance(patch: Partial<FormState>) {
    setStepError(null);
    setForm((prev) => ({ ...prev, ...patch }));
    const target = Math.min(6, step + 1);
    setStep(target);
    setMaxReached((m) => Math.max(m, target));
  }

  const optionBtn = (selected: boolean) =>
    cn(
      "relative z-10 block w-full cursor-pointer rounded-2xl border px-5 py-5 text-left text-base font-semibold text-white transition",
      "bg-[#0b1528] hover:border-cyan-400/55 hover:bg-cyan-400/10",
      "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-400",
      "active:scale-[0.99]",
      selected
        ? "border-cyan-400 bg-cyan-400/20 shadow-[0_0_28px_rgba(34,211,238,0.28)]"
        : "border-white/15"
    );

  return (
    <div className="relative z-20 mx-auto max-w-3xl isolate">
      <nav className="mb-8" aria-label="Request steps">
        <ol className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {STEPS.map(({ n, label }) => {
            const reached = n <= maxReached;
            const current = n === step;
            const done = n < step;
            const canClick = reached || n === step + 1;
            return (
              <li key={n} className="min-w-0">
                <button
                  type="button"
                  onClick={() => goToStep(n)}
                  disabled={!canClick}
                  aria-current={current ? "step" : undefined}
                  aria-label={`Go to step ${n}: ${label}`}
                  className={cn(
                    "flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition sm:px-2 sm:py-2.5",
                    current
                      ? "border-cyan-400/70 bg-cyan-400/15 text-cyan"
                      : done || reached
                        ? "border-electric/30 bg-white/5 text-silver hover:border-cyan-400/50 hover:text-cyan"
                        : "border-white/10 bg-transparent text-muted",
                    canClick ? "cursor-pointer" : "cursor-not-allowed opacity-45"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 sm:text-sm",
                      current || done
                        ? "bg-cyan-400 text-[#04101f]"
                        : reached
                          ? "bg-cyan-400/35 text-white"
                          : "bg-white/10 text-muted"
                    )}
                  >
                    {n}
                  </span>
                  <span className="hidden w-full truncate text-center text-[9px] font-semibold uppercase tracking-wider sm:block sm:text-[10px]">
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Select a category</h2>
          <div className="grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Service category">
            {CATEGORIES.map((c) => (
              <label
                key={c.id}
                className={optionBtn(form.serviceCategory === c.id)}
              >
                <input
                  type="radio"
                  name="serviceCategory"
                  value={c.id}
                  checked={form.serviceCategory === c.id}
                  className="sr-only"
                  onChange={() => selectAndAdvance({ serviceCategory: c.id })}
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Emergency or scheduled?</h2>
          <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Urgency">
            <label className={optionBtn(form.isEmergency === true)}>
              <input
                type="radio"
                name="isEmergency"
                value="yes"
                checked={form.isEmergency === true}
                className="sr-only"
                onChange={() => selectAndAdvance({ isEmergency: true })}
              />
              24/7 Emergency
            </label>
            <label className={optionBtn(form.isEmergency === false)}>
              <input
                type="radio"
                name="isEmergency"
                value="no"
                checked={form.isEmergency === false}
                className="sr-only"
                onChange={() => selectAndAdvance({ isEmergency: false })}
              />
              Scheduled service
            </label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Choose the specific service</h2>
          <div className="grid gap-3" role="radiogroup" aria-label="Specific service">
            {serviceOptions.map((s) => (
              <label key={s} className={optionBtn(form.specificService === s)}>
                <input
                  type="radio"
                  name="specificService"
                  value={s}
                  checked={form.specificService === s}
                  className="sr-only"
                  onChange={() => selectAndAdvance({ specificService: s })}
                />
                {s}
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-white">Property & issue details</h2>
          <select
            className="field"
            value={form.propertyType}
            onChange={(e) => update("propertyType", e.target.value as "residential" | "commercial")}
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
          <div>
            <textarea
              className="field"
              rows={5}
              placeholder="Describe the issue (what’s wrong, where, urgency…)"
              value={form.issueDetails}
              onChange={(e) => update("issueDetails", e.target.value)}
              aria-invalid={Boolean(stepError && form.issueDetails.trim().length < 5)}
            />
            <p className="mt-1.5 text-xs text-slate-400">
              {form.issueDetails.trim().length}/5 characters minimum
            </p>
          </div>
          <input
            className="field"
            placeholder="Address or general GTA location"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="date"
              className="field"
              value={form.preferredDate}
              onChange={(e) => update("preferredDate", e.target.value)}
            />
            <input
              className="field"
              placeholder="Preferred time"
              value={form.preferredTime}
              onChange={(e) => update("preferredTime", e.target.value)}
            />
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
          <input
            className="field"
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
          <input
            className="field"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <input
            className="field"
            placeholder="Phone (10 digits)"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          <select
            className="field"
            value={form.customerType}
            onChange={(e) => update("customerType", e.target.value)}
          >
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

      {stepError ? (
        <p
          className="mt-6 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-red-200"
          role="alert"
        >
          {stepError}
        </p>
      ) : null}

      <div className="btn-stack mt-8 justify-between sm:flex-row">
        <button
          type="button"
          className="btn-secondary order-2 sm:order-1"
          disabled={step === 1}
          onClick={() => goToStep(step - 1)}
        >
          Back
        </button>
        {step < 6 ? (
          <button
            type="button"
            className="btn-primary order-1 sm:order-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:grayscale"
            disabled={!canContinue}
            onClick={next}
            aria-disabled={!canContinue}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary order-1 sm:order-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:grayscale"
            disabled={submitting || !canContinue}
            onClick={submit}
          >
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        )}
      </div>
    </div>
  );
}
