"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { ProfileForm } from "@/lib/types";
import RegisterPasskeyButton from "../components/RegisterPasskeyButton";

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>({
    businessName: "",
    ownerName: "",
    gstNo: "",
    phone: "",
    address: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    logo: "",
    signature: "",
  });

  const [original, setOriginal] = useState<ProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { loading: authLoading, user } = useAuth();

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data: Partial<ProfileForm>) => {
        const merged = { ...form, ...data };
        setForm(merged);
        setOriginal(merged);
      })
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(original);

  const save = async () => {
    try {
      setSaving(true);

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success("Profile updated");
      setOriginal(form);
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading)
    return <div className="p-10 text-center text-gray-500">Loading profile...</div>;

  if (!user)
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Not Authorized</h2>
        <p className="text-gray-500 mt-2">Please login to access profile.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 pb-28 pt-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-blue-700">Business Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          These details appear on invoices
        </p>
      </div>

      <Section title="Business Details">
        <Input label="Business Name" value={form.businessName} onChange={(v)=>update("businessName",v)} />
        <Input label="Owner Name" value={form.ownerName} onChange={(v)=>update("ownerName",v)} />
        <Input label="GST Number" value={form.gstNo} onChange={(v)=>update("gstNo",v)} />
      </Section>

      <Section title="Contact">
        <Input label="Phone Number" value={form.phone} onChange={(v)=>update("phone",v)} />
        <Textarea label="Business Address" value={form.address} onChange={(v)=>update("address",v)} />
      </Section>

      <Section title="Bank Details">
        <Input label="Bank Name" value={form.bankName} onChange={(v)=>update("bankName",v)} />
        <Input label="Account Number" value={form.accountNumber} onChange={(v)=>update("accountNumber",v)} />
        <Input label="IFSC Code" value={form.ifscCode} onChange={(v)=>update("ifscCode",v)} />
        <Input label="UPI ID" value={form.upiId} onChange={(v)=>update("upiId",v)} />
      </Section>

      <Section title="Branding">
        <ImageInput label="Logo URL" value={form.logo} onChange={(v)=>update("logo",v)} />
        <ImageInput label="Signature URL" value={form.signature} onChange={(v)=>update("signature",v)} />
      </Section>

      {/* PASSKEY SECTION */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="font-semibold">Passkeys</p>
          <p className="text-sm text-gray-500">
            {user.credentials?.length || 0} registered device(s)
          </p>
        </div>

        <RegisterPasskeyButton />
      </div>

      {/* SAVE BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 backdrop-blur">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={save}
            disabled={!hasChanges || saving}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold transition
            disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {saving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
          </button>
        </div>
      </div>

    </div>
  );
}

/* ---------- UI ---------- */

function Section({ title, children }: any) {
  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
      <h2 className="font-semibold text-blue-700">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function Input({ label, value, onChange }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}


interface TextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function Textarea({ label, value, onChange }: TextareaProps) {
  return (
    <div className="space-y-1 md:col-span-2">
      <label className="text-sm text-gray-600">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}


interface ImageInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function ImageInput({ label, value, onChange }: ImageInputProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm text-gray-600">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {value && (
        <img
          src={value}
          alt="preview"
          className="h-20 object-contain border rounded-lg p-2 bg-gray-50"
        />
      )}
    </div>
  );
}

