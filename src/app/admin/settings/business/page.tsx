"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { getDefaultBusinessProfile, type BusinessProfile } from "@/lib/server/business-profile";
import { Building2, Globe, Phone, Share2, Save, RotateCcw } from "lucide-react";

export default function BusinessProfilePage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<BusinessProfile>(getDefaultBusinessProfile());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminClient
      .getSettings()
      .then((settings) => {
        const found = settings.global.find((g) => g.key === "business");
        if (found?.value && typeof found.value === "object") {
          setProfile({ ...getDefaultBusinessProfile(), ...(found.value as Partial<BusinessProfile>) });
        }
      })
      .catch((e) => addToast({ title: "Could not load profile", message: errorMessage(e), type: "error" }))
      .finally(() => setLoading(false));
  }, [addToast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminClient.saveSetting("business", profile);
      addToast({ title: "Business Profile Saved", message: "Canonical business identity updated.", type: "success" });
    } catch (e) {
      addToast({ title: "Could not save", message: errorMessage(e), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset business profile to system defaults?")) return;
    try {
      await adminClient.resetSetting("business");
      setProfile(getDefaultBusinessProfile());
      addToast({ title: "Reset Complete", message: "Restored to SITE_CONFIG default identity.", type: "success" });
    } catch (e) {
      addToast({ title: "Could not reset", message: errorMessage(e), type: "error" });
    }
  };

  const inputClass = "w-full px-3 py-2 text-xs border border-[#E8E5E2] rounded-lg focus:outline-none focus:border-[#FF5A00] bg-white";

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Business Profile"
        subtitle="One canonical source for business name, contact info, brand assets, social profiles, and Organization SEO schema."
        breadcrumbs={[{ label: "Settings" }, { label: "Business Profile" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E5E2] rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 bg-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF5A00] text-white text-xs font-bold hover:bg-[#FF8A3D] transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving…" : "Save Profile"}</span>
            </button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="px-4 sm:px-6 max-w-5xl space-y-6">
        <section className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E8E5E2] pb-3">
            <Building2 className="w-4 h-4 text-[#FF5A00]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">Brand &amp; Identity</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Business Name</label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Short Name</label>
              <input
                type="text"
                value={profile.shortName}
                onChange={(e) => setProfile({ ...profile, shortName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-stone-700">Tagline / Mission</label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Logo Asset URL</label>
              <input
                type="text"
                value={profile.logo}
                onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Favicon Asset URL</label>
              <input
                type="text"
                value={profile.favicon}
                onChange={(e) => setProfile({ ...profile, favicon: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E8E5E2] pb-3">
            <Phone className="w-4 h-4 text-[#FF5A00]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">Contact &amp; Regional</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Primary Email</label>
              <input
                type="email"
                value={profile.primaryEmail}
                onChange={(e) => setProfile({ ...profile, primaryEmail: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Primary Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">WhatsApp Number</label>
              <input
                type="text"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Canonical Website URL</label>
              <input
                type="url"
                value={profile.websiteUrl}
                onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Default Locale</label>
              <input
                type="text"
                value={profile.defaultLocale}
                onChange={(e) => setProfile({ ...profile, defaultLocale: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Timezone</label>
              <input
                type="text"
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E8E5E2] pb-3">
            <Share2 className="w-4 h-4 text-[#FF5A00]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">Social Links</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-stone-700">LinkedIn</label>
              <input
                type="url"
                value={profile.social.linkedin || ""}
                onChange={(e) => setProfile({ ...profile, social: { ...profile.social, linkedin: e.target.value } })}
                className={inputClass}
                placeholder="https://linkedin.com/company/…"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">GitHub</label>
              <input
                type="url"
                value={profile.social.github || ""}
                onChange={(e) => setProfile({ ...profile, social: { ...profile.social, github: e.target.value } })}
                className={inputClass}
                placeholder="https://github.com/…"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Twitter / X</label>
              <input
                type="url"
                value={profile.social.twitter || ""}
                onChange={(e) => setProfile({ ...profile, social: { ...profile.social, twitter: e.target.value } })}
                className={inputClass}
                placeholder="https://x.com/…"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Instagram</label>
              <input
                type="url"
                value={profile.social.instagram || ""}
                onChange={(e) => setProfile({ ...profile, social: { ...profile.social, instagram: e.target.value } })}
                className={inputClass}
                placeholder="https://instagram.com/…"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E8E5E2] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E8E5E2] pb-3">
            <Globe className="w-4 h-4 text-[#FF5A00]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B0B0F]">Organization SEO Schema</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Legal Name</label>
              <input
                type="text"
                value={profile.organizationSchema.legalName || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    organizationSchema: { ...profile.organizationSchema, legalName: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Founding Year</label>
              <input
                type="text"
                value={profile.organizationSchema.foundingYear || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    organizationSchema: { ...profile.organizationSchema, foundingYear: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Price Range</label>
              <input
                type="text"
                value={profile.organizationSchema.priceRange || "$$"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    organizationSchema: { ...profile.organizationSchema, priceRange: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
