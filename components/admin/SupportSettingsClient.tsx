"use client";

import React, { useState, useEffect } from "react";
import {
  Headphones,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Eye,
} from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { SupportContactItem, SupportSettings } from "@/lib/site-settings";

export default function SupportSettingsClient() {
  const { settings, updateSettings, resetSettings, isLoading } = useSiteSettings();

  const [title, setTitle] = useState(settings.support.title);
  const [subtitle, setSubtitle] = useState(settings.support.subtitle);
  const [workingHours, setWorkingHours] = useState(settings.support.workingHours);
  const [emergencyNote, setEmergencyNote] = useState(settings.support.emergencyNote || "");
  const [contacts, setContacts] = useState<SupportContactItem[]>(settings.support.contacts || []);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && settings.support) {
      setTimeout(() => {
        setTitle(settings.support.title);
        setSubtitle(settings.support.subtitle);
        setWorkingHours(settings.support.workingHours);
        setEmergencyNote(settings.support.emergencyNote || "");
        setContacts(settings.support.contacts || []);
      }, 0);
    }
  }, [settings, isLoading]);

  const handleContactChange = (
    index: number,
    field: keyof SupportContactItem,
    val: unknown
  ) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: val };
    setContacts(updated);
  };

  const handleAddContact = () => {
    const newId = `contact-custom-${Date.now()}`;
    const newContact: SupportContactItem = {
      id: newId,
      name: "Saluran Kontak Baru",
      type: "whatsapp",
      value: "0812-3456-7890",
      actionUrl: "https://wa.me/6281234567890?text=Halo%20Admin%20Tapak",
      description: "Hubungi konsultan kami untuk bantuan teknis dan transaksi.",
      badge: "Baru",
      isActive: true,
    };
    setContacts([...contacts, newContact]);
  };

  const handleDeleteContact = (index: number) => {
    if (contacts.length <= 1) {
      alert("Harus ada minimal 1 saluran kontak bantuan yang terdaftar.");
      return;
    }
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const supportPayload: SupportSettings = {
      title,
      subtitle,
      workingHours,
      emergencyNote,
      contacts,
    };

    const ok = await updateSettings({ support: supportPayload });
    setSaving(false);

    if (ok) {
      setSuccessMessage("Pengaturan kontak bantuan dan jam operasional berhasil disimpan & diperbarui di portal Owner!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setErrorMessage("Gagal menyimpan pengaturan kontak. Silakan coba lagi.");
    }
  };

  const handleReset = async () => {
    if (!confirm("Kembalikan seluruh daftar kontak dan jam operasional ke standar bawaan Tapak.?")) {
      return;
    }
    setSaving(true);
    const ok = await resetSettings();
    setSaving(false);
    if (ok) {
      setSuccessMessage("Pengaturan kontak bantuan telah direset ke standar.");
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const getContactIcon = (type: SupportContactItem["type"]) => {
    switch (type) {
      case "whatsapp":
        return <MessageCircle className="w-5 h-5 text-emerald-600" />;
      case "email":
        return <Mail className="w-5 h-5 text-[#3D77EE]" />;
      case "phone":
        return <Phone className="w-5 h-5 text-amber-600" />;
      default:
        return <Headphones className="w-5 h-5 text-[#3D77EE]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-[8px] bg-blue-50 text-[#3D77EE]">
              <Headphones className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Pengaturan Kontak Bantuan &amp; Dukungan Owner
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Konfigurasi saluran kontak resmi (WhatsApp CS, Helpdesk Email, Telepon) dan jam operasional yang tampil pada popup &quot;Bantuan &amp; Dukungan&quot; di portal Mitra Owner.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="px-3.5 py-2 rounded-[10px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
      {successMessage && (
        <div className="p-4 rounded-[12px] bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs sm:text-sm font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-[12px] bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs sm:text-sm font-semibold text-rose-800 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Preview Modal Card */}
      <div className="bg-white rounded-[18px] p-5 sm:p-6 border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#3D77EE]" />
            <h3 className="font-bold text-sm text-[#111827]">
              Pratinjau Interaktif Popup Bantuan Owner (Live Preview)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Tampilan seketika saat mitra mengklik tombol bantuan di dashboard
          </span>
        </div>

        <div className="p-4 sm:p-6 rounded-[14px] bg-slate-100 border border-slate-200 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-[20px] border border-[#E2E8F0] shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-[#3D77EE] text-white flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm text-[#111827] block">
                    {title || "Pusat Bantuan & Dukungan Mitra Tapak."}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online • Respon Cepat
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-[10px] bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#3D77EE] shrink-0" />
              <span className="text-[11px] truncate">{workingHours}</span>
            </div>

            <div className="space-y-2">
              {contacts
                .filter((c) => c.isActive)
                .map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-[12px] bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-[6px] bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        {getContactIcon(c.type)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#111827] block truncate">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate font-mono">
                          {c.value}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-[6px] text-[10px] font-bold text-white bg-[#3D77EE] shrink-0">
                      Hubungi
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: Informasi & Jam Operasional */}
        <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-[#111827] pb-3 border-b border-[#E2E8F0] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#3D77EE]" />
            <span>Informasi Judul &amp; Jam Operasional</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5">
                Judul Utama Popup Bantuan
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pusat Bantuan & Dukungan Mitra Tapak."
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-sm font-bold text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5">
                Jam Operasional Layanan
              </label>
              <input
                type="text"
                required
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="Senin – Minggu: 08.00 – 22.00 WIB"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-sm text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111827] mb-1.5">
                Deskripsi Sub-Judul Popup
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Konsultasikan kendala akun, pembayaran paket iklan, atau panduan verifikasi..."
                className="w-full px-3.5 py-2 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111827] mb-1.5">
                Catatan Layanan Darurat (Emergency Note)
              </label>
              <input
                type="text"
                value={emergencyNote}
                onChange={(e) => setEmergencyNote(e.target.value)}
                placeholder="Layanan konsultasi darurat transaksi tetap dilayani 24/7 melalui WhatsApp resmi."
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-slate-50 border border-[#E2E8F0] text-xs sm:text-sm text-[#111827] focus:outline-none focus:border-[#3D77EE] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Daftar Saluran Kontak */}
        <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-base text-[#111827] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Saluran Kontak yang Ditampilkan</span>
              </h3>
              <p className="text-xs text-[#687280] mt-0.5">
                Tambahkan nomor WhatsApp, email helpdesk resmi, atau hotline telepon untuk dihubungi mitra owner.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddContact}
              className="px-3.5 py-1.5 rounded-[8px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kontak</span>
            </button>
          </div>

          <div className="space-y-4">
            {contacts.map((contact, idx) => (
              <div
                key={contact.id}
                className="p-4 sm:p-5 rounded-[14px] bg-slate-50 border border-[#E2E8F0] space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#111827] text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-[#111827]">
                      {contact.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contact.isActive}
                        onChange={(e) => handleContactChange(idx, "isActive", e.target.checked)}
                        className="w-4 h-4 accent-[#3D77EE] rounded"
                      />
                      <span className={contact.isActive ? "text-emerald-600" : "text-slate-400"}>
                        {contact.isActive ? "Aktif Tampil" : "Nonaktif"}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteContact(idx)}
                      className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus saluran kontak"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Label Saluran
                    </label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleContactChange(idx, "name", e.target.value)}
                      placeholder="Layanan CS WhatsApp"
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tipe Saluran
                    </label>
                    <select
                      value={contact.type}
                      onChange={(e) =>
                        handleContactChange(
                          idx,
                          "type",
                          e.target.value as SupportContactItem["type"]
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs font-semibold text-slate-800"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="phone">Telepon / Hotline</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nilai / Nomor / Email yang Ditampilkan
                    </label>
                    <input
                      type="text"
                      value={contact.value}
                      onChange={(e) => handleContactChange(idx, "value", e.target.value)}
                      placeholder="0812-3456-7890 atau bantuan@tapak.id"
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tautan Aksi (Action URL / WhatsApp API Link / Mailto)
                    </label>
                    <input
                      type="text"
                      value={contact.actionUrl}
                      onChange={(e) => handleContactChange(idx, "actionUrl", e.target.value)}
                      placeholder="https://wa.me/6281234567890?text=Halo%20Tapak..."
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs font-mono text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Badge Label (Opsional)
                    </label>
                    <input
                      type="text"
                      value={contact.badge || ""}
                      onChange={(e) => handleContactChange(idx, "badge", e.target.value)}
                      placeholder="Paling Cepat / Resmi"
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs text-slate-700"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Deskripsi Singkat Saluran
                    </label>
                    <input
                      type="text"
                      value={contact.description}
                      onChange={(e) => handleContactChange(idx, "description", e.target.value)}
                      placeholder="Respon cepat chat WhatsApp, bantuan listing, dan verifikasi akun."
                      className="w-full px-3 py-1.5 rounded-[8px] bg-white border border-[#E2E8F0] text-xs text-slate-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-[10px] text-xs sm:text-sm font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Pengaturan Kontak"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
