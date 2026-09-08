"use client";

import React from "react";

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

export default function PropertyPagination({
  currentPage = 1,
  totalPages = 3,
  totalItems = 12,
  startIndex = 1,
  endIndex = 4,
  onPageChange,
}: PropertyPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 pb-8 text-xs">
      <div className="text-slate-500">
        Menampilkan <b className="text-[#111827] font-bold">{startIndex}-{endIndex}</b> dari{" "}
        <b className="text-[#111827] font-bold">{totalItems}</b> properti terdaftar
      </div>

      <div className="flex items-center gap-1.5 font-bold">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3.5 py-2 rounded-xl bg-white text-[#111827] border border-slate-200/80 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
        >
          &lsaquo; Sebelumnya
        </button>

        {[1, 2, 3].slice(0, totalPages).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-xl transition-all cursor-pointer ${
              currentPage === p
                ? "bg-[#3D77EE] text-white shadow-sm"
                : "bg-white text-[#111827] border border-slate-200/80 hover:bg-slate-50 shadow-2xs"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3.5 py-2 rounded-xl bg-white text-[#111827] border border-slate-200/80 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
        >
          Selanjutnya &rsaquo;
        </button>
      </div>
    </div>
  );
}
