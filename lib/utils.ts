import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatShortRupiah(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Rp 0";
  if (num >= 1_000_000_000) {
    const val = num / 1_000_000_000;
    return `${val % 1 === 0 ? val : val.toFixed(1).replace(".", ",")} M`;
  }
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return `${val % 1 === 0 ? val : val.toFixed(1).replace(".", ",")} Jt`;
  }
  if (num >= 1_000) {
    const val = num / 1_000;
    return `${val % 1 === 0 ? val : val.toFixed(1).replace(".", ",")} Rb`;
  }
  return num.toString();
}

export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  waitMs: number = 300
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, waitMs);
  };
}

export function formatWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Format jumlah unit kategori sesuai ketentuan Tapak:
 * - Jika count < 1000: tampilkan angka murni (misal: "3 Unit", "2 Kamar", "1 Vila")
 * - Jika count >= 1000 dan tepat kelipatan 1000: tampilkan kelipatan seribu (misal: "1.000 Unit", "2.000 Unit", "3.000 Unit")
 * - Jika count >= 1000 dan masih di antara kelipatan 1000: tampilkan dengan tanda plus (misal: "1.000+ Unit", "2.000+ Unit", "3.000+ Unit")
 */
export function formatCategoryUnitCount(count: number, unitLabel: string = "Unit"): string {
  const safeCount = Math.max(0, Math.floor(count || 0));

  if (safeCount < 1000) {
    return `${safeCount.toLocaleString("id-ID")} ${unitLabel}`;
  }

  // Jika tepat kelipatan 1000 (1000, 2000, 3000, dst)
  if (safeCount % 1000 === 0) {
    return `${safeCount.toLocaleString("id-ID")} ${unitLabel}`;
  }

  // Jika masih di antara kelipatan 1000 (misal: 1001-1999 -> 1.000+, 2001-2999 -> 2.000+)
  const lowerThousand = Math.floor(safeCount / 1000) * 1000;
  return `${lowerThousand.toLocaleString("id-ID")}+ ${unitLabel}`;
}
