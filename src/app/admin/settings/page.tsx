"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-client";
import {
  PageHeader,
  AdminCard,
  FieldLabel,
  TextInput,
  TextTextarea,
} from "@/components/admin/AdminForm";
import { Skeleton } from "@/components/ui/Skeleton";

interface SettingsForm {
  businessName: string;
  logoUrl?: string;
  faviconUrl?: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  serviceArea: string;
  businessHours: string;
  emergencyAvailability: string;
  emergencyAvailable?: boolean;
  specialOfferText?: string;
  specialOfferPercent?: number;
  specialOfferActive?: boolean;
  footerDescription?: string;
  contactFormRecipient?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  analyticsId?: string;
  mapEmbed?: string;
  copyrightText?: string;
  pricingDisclaimer?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    google?: string;
  };
}

const empty: SettingsForm = {
  businessName: "VNEC",
  phone: "437-256-1028",
  emergencyPhone: "437-256-1028",
  email: "vnecconstruction@gmail.com",
  serviceArea: "Greater Toronto Area, Ontario",
  businessHours: "Monday–Saturday: 9:00 AM–5:00 PM",
  emergencyAvailability: "Available 24/7",
  emergencyAvailable: true,
  specialOfferActive: true,
  socialLinks: {},
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ settings: SettingsForm }>("/api/settings")
      .then((data) => {
        setForm({
          ...empty,
          ...data.settings,
          socialLinks: data.settings.socialLinks || {},
        });
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const data = await adminFetch<{ settings: SettingsForm }>("/api/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setForm({
        ...empty,
        ...data.settings,
        socialLinks: data.settings.socialLinks || {},
      });
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="Business details, offers, SEO defaults, and legal disclaimer copy"
        actions={
          <button type="button" onClick={save} disabled={saving} className="btn-primary !px-4 !py-2 text-sm">
            {saving ? "Saving..." : "Save settings"}
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminCard title="Business">
          <div className="grid gap-4">
            <div>
              <FieldLabel>Business name</FieldLabel>
              <TextInput value={form.businessName} onChange={(e) => update("businessName", e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Phone</FieldLabel>
                <TextInput value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div>
                <FieldLabel>Emergency phone</FieldLabel>
                <TextInput
                  value={form.emergencyPhone}
                  onChange={(e) => update("emergencyPhone", e.target.value)}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <TextInput type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <FieldLabel>Contact form recipient</FieldLabel>
              <TextInput
                type="email"
                value={form.contactFormRecipient || ""}
                onChange={(e) => update("contactFormRecipient", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Service area</FieldLabel>
              <TextInput value={form.serviceArea} onChange={(e) => update("serviceArea", e.target.value)} />
            </div>
            <div>
              <FieldLabel>Business hours</FieldLabel>
              <TextInput value={form.businessHours} onChange={(e) => update("businessHours", e.target.value)} />
            </div>
            <div>
              <FieldLabel>Emergency availability</FieldLabel>
              <TextInput
                value={form.emergencyAvailability}
                onChange={(e) => update("emergencyAvailability", e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={!!form.emergencyAvailable}
                onChange={(e) => update("emergencyAvailable", e.target.checked)}
              />
              Emergency available
            </label>
          </div>
        </AdminCard>

        <AdminCard title="Brand & offer">
          <div className="grid gap-4">
            <div>
              <FieldLabel>Logo URL</FieldLabel>
              <TextInput value={form.logoUrl || ""} onChange={(e) => update("logoUrl", e.target.value)} />
            </div>
            <div>
              <FieldLabel>Favicon URL</FieldLabel>
              <TextInput value={form.faviconUrl || ""} onChange={(e) => update("faviconUrl", e.target.value)} />
            </div>
            <div>
              <FieldLabel>Special offer text</FieldLabel>
              <TextInput
                value={form.specialOfferText || ""}
                onChange={(e) => update("specialOfferText", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Special offer percent</FieldLabel>
              <TextInput
                type="number"
                value={form.specialOfferPercent ?? 5}
                onChange={(e) => update("specialOfferPercent", Number(e.target.value))}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={!!form.specialOfferActive}
                onChange={(e) => update("specialOfferActive", e.target.checked)}
              />
              Special offer active
            </label>
            <div>
              <FieldLabel>Footer description</FieldLabel>
              <TextTextarea
                value={form.footerDescription || ""}
                onChange={(e) => update("footerDescription", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Copyright text</FieldLabel>
              <TextInput
                value={form.copyrightText || ""}
                onChange={(e) => update("copyrightText", e.target.value)}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="SEO & analytics">
          <div className="grid gap-4">
            <div>
              <FieldLabel>Default SEO title</FieldLabel>
              <TextInput
                value={form.defaultSeoTitle || ""}
                onChange={(e) => update("defaultSeoTitle", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Default SEO description</FieldLabel>
              <TextTextarea
                value={form.defaultSeoDescription || ""}
                onChange={(e) => update("defaultSeoDescription", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Analytics ID</FieldLabel>
              <TextInput
                value={form.analyticsId || ""}
                onChange={(e) => update("analyticsId", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Map embed HTML</FieldLabel>
              <TextTextarea
                value={form.mapEmbed || ""}
                onChange={(e) => update("mapEmbed", e.target.value)}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Social & pricing disclaimer">
          <div className="grid gap-4">
            {(["facebook", "instagram", "linkedin", "google"] as const).map((key) => (
              <div key={key}>
                <FieldLabel className="capitalize">{key}</FieldLabel>
                <TextInput
                  value={form.socialLinks?.[key] || ""}
                  onChange={(e) =>
                    update("socialLinks", { ...form.socialLinks, [key]: e.target.value })
                  }
                />
              </div>
            ))}
            <div>
              <FieldLabel>Pricing disclaimer</FieldLabel>
              <TextTextarea
                value={form.pricingDisclaimer || ""}
                onChange={(e) => update("pricingDisclaimer", e.target.value)}
              />
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="mt-6">
        <button type="button" onClick={save} disabled={saving} className="btn-primary !px-5 !py-2.5 text-sm">
          {saving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </div>
  );
}
