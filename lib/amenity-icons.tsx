import React from "react";
import {
  Train,
  Stethoscope,
  GraduationCap,
  Building2,
  ShoppingBag,
  Footprints,
  School,
  Wind,
  Wifi,
  Waves,
  Dumbbell,
  Car,
  Utensils,
  ShieldCheck,
  ArrowUpDown,
  Tv,
  Trees,
  Sun,
  Droplets,
  KeyRound,
  Sofa,
  Film,
  Wine,
  Sparkles,
  Activity,
  Check,
  Zap,
} from "lucide-react";

/**
 * Mendapatkan komponen icon monokromatik untuk Fasilitas Sekitar (Nearby POI)
 */
export function getNearbyAmenityIcon(
  category: "TRANSPORT" | "EDUCATION" | "HEALTH" | "WORSHIP" | "SHOPPING" | string,
  className = "w-4 h-4"
): React.ReactNode {
  switch (category.toUpperCase()) {
    case "TRANSPORT":
      return <Train className={className} />;
    case "HEALTH":
      return <Stethoscope className={className} />;
    case "EDUCATION":
      return <GraduationCap className={className} />;
    case "WORSHIP":
      return <Building2 className={className} />;
    case "SHOPPING":
      return <ShoppingBag className={className} />;
    case "WALK":
      return <Footprints className={className} />;
    case "SCHOOL":
      return <School className={className} />;
    default:
      return <Building2 className={className} />;
  }
}

/**
 * Mendapatkan icon monokromatik untuk Fasilitas Unit Properti berdasarkan teks nama fasilitas
 */
export function getUnitAmenityIcon(
  amenityName: string,
  className = "w-3.5 h-3.5"
): React.ReactNode {
  const name = amenityName.toLowerCase();

  if (name.includes("ac") || name.includes("air cond") || name.includes("inverter")) {
    return <Wind className={className} />;
  }
  if (name.includes("wifi") || name.includes("internet") || name.includes("fiber")) {
    return <Wifi className={className} />;
  }
  if (name.includes("kolam") || name.includes("pool") || name.includes("swimming") || name.includes("jacuzzi")) {
    return <Waves className={className} />;
  }
  if (name.includes("gym") || name.includes("fitness") || name.includes("pilates") || name.includes("yoga")) {
    return <Dumbbell className={className} />;
  }
  if (name.includes("parkir") || name.includes("carport") || name.includes("garasi") || name.includes("parking") || name.includes("mobil")) {
    return <Car className={className} />;
  }
  if (name.includes("dapur") || name.includes("kitchen") || name.includes("pantry") || name.includes("dining")) {
    return <Utensils className={className} />;
  }
  if (name.includes("keamanan") || name.includes("security") || name.includes("cctv") || name.includes("biometrik") || name.includes("guard") || name.includes("gate")) {
    return <ShieldCheck className={className} />;
  }
  if (name.includes("lift") || name.includes("elevator")) {
    return <ArrowUpDown className={className} />;
  }
  if (name.includes("tv") || name.includes("smart tv") || name.includes("theater") || name.includes("bioskop")) {
    return <Film className={className} />;
  }
  if (name.includes("smart home") || name.includes("automation") || name.includes("genset") || name.includes("listrik") || name.includes("va")) {
    return <Zap className={className} />;
  }
  if (name.includes("taman") || name.includes("garden") || name.includes("botanical") || name.includes("halaman")) {
    return <Trees className={className} />;
  }
  if (name.includes("balkon") || name.includes("rooftop") || name.includes("terrace") || name.includes("terras")) {
    return <Sun className={className} />;
  }
  if (name.includes("water heater") || name.includes("air panas") || name.includes("pam") || name.includes("sumur") || name.includes("solar water")) {
    return <Droplets className={className} />;
  }
  if (name.includes("kunci") || name.includes("key") || name.includes("digital lock") || name.includes("card") || name.includes("smart card") || name.includes("rfid")) {
    return <KeyRound className={className} />;
  }
  if (name.includes("furnish") || name.includes("mezzanine") || name.includes("sofa") || name.includes("wood") || name.includes("suite")) {
    return <Sofa className={className} />;
  }
  if (name.includes("wine") || name.includes("bar")) {
    return <Wine className={className} />;
  }
  if (name.includes("housekeeping") || name.includes("cleaning") || name.includes("laundry") || name.includes("concierge")) {
    return <Sparkles className={className} />;
  }
  if (name.includes("tennis") || name.includes("sport") || name.includes("lapangan") || name.includes("clubhouse")) {
    return <Activity className={className} />;
  }

  return <Check className={className} />;
}
