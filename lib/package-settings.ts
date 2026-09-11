import fs from "fs";
import path from "path";
import { PackageDefinition, DEFAULT_PACKAGES } from "./package-definitions";

export type { PackageDefinition };
export { DEFAULT_PACKAGES };

const PACKAGES_DIR = path.join(process.cwd(), "data");
const PACKAGES_FILE = path.join(PACKAGES_DIR, "packages.json");

function ensureStorageDir() {
  if (!fs.existsSync(PACKAGES_DIR)) {
    fs.mkdirSync(PACKAGES_DIR, { recursive: true });
  }
}

export function getPackagesConfig(): PackageDefinition[] {
  try {
    ensureStorageDir();
    if (fs.existsSync(PACKAGES_FILE)) {
      const raw = fs.readFileSync(PACKAGES_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading packages.json:", err);
  }
  return DEFAULT_PACKAGES;
}

export function savePackagesConfig(pkgs: PackageDefinition[]): PackageDefinition[] {
  try {
    ensureStorageDir();
    fs.writeFileSync(PACKAGES_FILE, JSON.stringify(pkgs, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving packages.json:", err);
  }
  return pkgs;
}
