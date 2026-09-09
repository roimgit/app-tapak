"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah prospek pembeli/penyewa akan langsung menghubungi WhatsApp saya?",
      a: "Ya, 100% langsung tanpa pihak ketiga. Tombol WhatsApp pada listing Anda diprogram untuk langsung membuka ruang obrolan ke nomor ponsel pribadi atau kantor yang Anda cantumkan. Tidak ada komisi penjualan yang ditarik oleh Tapak.",
    },
    {
      q: "Bagaimana jika properti saya sudah laku sebelum masa tayang paket berakhir?",
      a: "Anda dapat menandai listing tersebut sebagai 'Terjual' atau 'Tersewa' kapan saja melalui Dashboard Owner. Sisa masa aktif tidak akan hangus—Anda dapat menggantinya dengan unit properti lain untuk mengisi slot kuota yang tersisa selama paket Anda masih aktif.",
    },
    {
      q: "Bagaimana cara perpanjangan masa tayang iklan?",
      a: "Sistem Tapak akan mengirimkan notifikasi pengingat H-7 dan H-3 via WhatsApp dan email resmi Anda. Anda cukup mengonfirmasi perpanjangan dengan 1 klik melalui tautan pembayaran tanpa perlu repot mengunggah ulang data spesifikasi teknis ataupun galeri foto.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="mt-16">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[11px] font-bold text-[#3D77EE] uppercase tracking-wider block mb-1">
          Pusat Bantuan Pemilik
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p className="text-xs sm:text-sm text-[#687280] mt-1">
          Jawaban jelas dan transparan seputar sewa lapak serta pengelolaan iklan Anda.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-[18px] p-5 sm:p-6 shadow-xs border border-slate-100 transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-hidden"
              >
                <span className="text-sm sm:text-base font-bold text-[#111827]">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#3D77EE] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <p className="mt-3 text-xs sm:text-sm text-[#687280] leading-relaxed pt-2 border-t border-slate-100">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
