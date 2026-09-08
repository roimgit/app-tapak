import React from "react";
import Link from "next/link";
import { Building2, Home, Compass, Sparkles, ArrowRight } from "lucide-react";

export default function CategorySection() {
  const categories = [
    {
      label: "Apartemen",
      icon: Building2,
      desc: "Unit vertikal modern di pusat bisnis",
      href: "/explore?type=Apartemen",
      count: "350+ Unit",
    },
    {
      label: "Rumah Tapak",
      icon: Home,
      desc: "Hunian asri keluarga dengan taman & garasi",
      href: "/explore?type=Rumah",
      count: "210+ Unit",
    },
    {
      label: "Kost & Co-Living",
      icon: Compass,
      desc: "Kamar sewa fleksibel berfasilitas lengkap",
      href: "/explore?type=Kost",
      count: "500+ Kamar",
    },
    {
      label: "Vila Tropis",
      icon: Sparkles,
      desc: "Vila liburan privat dengan kolam renang",
      href: "/explore?type=Vila",
      count: "80+ Vila",
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              Pilih Kategori Sesuai Gaya Hidup
            </h2>
            <p className="text-sm text-[#687280] mt-1">
              Mulai dari apartemen komuter hingga vila tropis privat
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3D77EE] hover:text-[#2B55AB]"
          >
            <span>Lihat Seluruh Listing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className="p-6 rounded-[18px] bg-[#F3F6FB] border border-slate-200/60 hover:border-[#3D77EE] hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-[10px] bg-white group-hover:bg-[#3D77EE] group-hover:text-white text-[#3D77EE] border border-slate-200 flex items-center justify-center transition-colors shadow-xs mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#111827] group-hover:text-[#3D77EE] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-[#687280] mt-1.5 line-clamp-2">{cat.desc}</p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-[#3D77EE]">
                  <span>{cat.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
