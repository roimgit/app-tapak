"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

interface ImageUploadDropzoneProps {
  folder: "branding" | "properties" | "ads";
  initialUrl?: string;
  aspectRatioLabel?: string;
  label?: string;
  helpText?: string;
  onUploadSuccess: (url: string) => void;
}

export default function ImageUploadDropzone({
  folder,
  initialUrl,
  aspectRatioLabel = "Maks 5MB • JPG, PNG, WebP, SVG",
  label = "Unggah Gambar ke Supabase Storage",
  helpText,
  onUploadSuccess,
}: ImageUploadDropzoneProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToWebP = async (file: File): Promise<Blob> => {
    if (file.type === "image/svg+xml" || file.type === "image/webp") {
      return file;
    }

    return new Promise((resolve) => {
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else resolve(file);
            },
            "image/webp",
            0.85
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  const uploadFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      setSuccessInfo(null);

      if (!file.type.startsWith("image/")) {
        setErrorMessage("File harus berupa gambar (JPG, PNG, WebP, SVG).");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran gambar melebihi batas 5MB.");
        return;
      }

      setIsUploading(true);

      try {
        const processedBlob = await convertToWebP(file);
        const finalFileName = file.name.replace(/\.[^/.]+$/, ".webp");
        const formData = new FormData();
        formData.append("file", processedBlob, finalFileName);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();

        if (json.success && json.data?.url) {
          setCurrentUrl(json.data.url);
          onUploadSuccess(json.data.url);
          setSuccessInfo(
            json.data.url.startsWith("/uploads")
              ? "Gambar berhasil disimpan ke penyimpanan lokal Tapak!"
              : "Gambar berhasil diunggah ke Supabase Storage!"
          );
          setTimeout(() => setSuccessInfo(null), 4000);
        } else {
          setErrorMessage(json.error || "Gagal mengunggah gambar ke cloud.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setErrorMessage("Koneksi gagal saat mengunggah. Silakan coba lagi.");
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onUploadSuccess]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setCurrentUrl("");
    onUploadSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#111827]">{label}</label>
          {aspectRatioLabel && (
            <span className="text-[11px] font-medium text-slate-500">
              {aspectRatioLabel}
            </span>
          )}
        </div>
      )}

      {currentUrl ? (
        <div className="relative rounded-[14px] border border-[#E2E8F0] p-3 bg-white flex items-center gap-4 shadow-2xs">
          <div className="relative w-20 h-16 rounded-[10px] overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <Image
              src={currentUrl}
              alt="Pratinjau unggahan"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-emerald-800">
                {currentUrl.startsWith("/uploads")
                  ? "Tersimpan di Media Lokal Tapak"
                  : "Tersimpan di Supabase Storage (CDN)"}
              </span>
            </div>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#3D77EE] hover:underline truncate block mt-0.5"
            >
              {currentUrl}
            </a>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Ganti File
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="p-1.5 rounded-[8px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Hapus gambar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-[14px] p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-[#3D77EE] bg-blue-50/50"
              : "border-[#E2E8F0] hover:border-[#3D77EE]/60 bg-[#F3F6FB]/60 hover:bg-white"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <Loader2 className="w-6 h-6 text-[#3D77EE] animate-spin" />
              <p className="text-xs font-bold text-[#111827]">
                Mengompresi ke WebP &amp; mengunggah ke Supabase Storage...
              </p>
              <span className="text-[11px] text-slate-500">
                Mohon tunggu beberapa saat.
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3D77EE] flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#111827]">
                Tarik &amp; lepas file ke sini, atau{" "}
                <span className="text-[#3D77EE] underline">pilih dari perangkat</span>
              </p>
              <p className="text-[11px] text-slate-500">
                {helpText || "Otomatis dikonversi ke WebP untuk performa maksimal. File tidak membebani project."}
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successInfo && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}
    </div>
  );
}
