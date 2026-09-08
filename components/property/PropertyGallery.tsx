import React from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const defaultImage =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-10">
      <div className="md:col-span-2 relative aspect-[16/10] rounded-[18px] overflow-hidden bg-slate-200 shadow-sm border border-slate-200/80">
        <Image
          src={images[0] || defaultImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4">
        <div className="relative aspect-[16/10] rounded-[18px] overflow-hidden bg-slate-200 shadow-sm border border-slate-200/80">
          <Image
            src={images[1] || images[0] || defaultImage}
            alt={`${title} - Sudut Ruang`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="relative aspect-[16/10] rounded-[18px] overflow-hidden bg-slate-200 shadow-sm border border-slate-200/80">
          <Image
            src={images[2] || images[0] || defaultImage}
            alt={`${title} - Detail Unit`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </div>
    </div>
  );
}
