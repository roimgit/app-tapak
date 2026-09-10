import fs from "fs";
import path from "path";
import { SiteSettings, DEFAULT_SITE_SETTINGS } from "./site-settings";

const SETTINGS_FILE_PATH = path.join(process.cwd(), "data", "site-settings.json");

export function getSiteSettings(): SiteSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const content = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        branding: { ...DEFAULT_SITE_SETTINGS.branding, ...(parsed.branding || {}) },
        hero: { ...DEFAULT_SITE_SETTINGS.hero, ...(parsed.hero || {}) },
        billboard: Array.isArray(parsed.billboard)
          ? parsed.billboard
          : DEFAULT_SITE_SETTINGS.billboard,
        promoModal: { ...DEFAULT_SITE_SETTINGS.promoModal, ...(parsed.promoModal || {}) },
        support: parsed.support
          ? {
              ...DEFAULT_SITE_SETTINGS.support,
              ...parsed.support,
              contacts: Array.isArray(parsed.support.contacts)
                ? parsed.support.contacts
                : DEFAULT_SITE_SETTINGS.support.contacts,
            }
          : DEFAULT_SITE_SETTINGS.support,
      };
    }
  } catch (error) {
    console.error("Error reading site settings file:", error);
  }
  return DEFAULT_SITE_SETTINGS;
}

export function saveSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  try {
    const dirPath = path.join(process.cwd(), "data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const current = getSiteSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      branding: { ...current.branding, ...(settings.branding || {}) },
      hero: { ...current.hero, ...(settings.hero || {}) },
      billboard: settings.billboard || current.billboard,
      promoModal: { ...current.promoModal, ...(settings.promoModal || {}) },
      support: settings.support
        ? {
            ...current.support,
            ...settings.support,
            contacts: settings.support.contacts || current.support.contacts,
          }
        : current.support,
    };

    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (error) {
    console.error("Error saving site settings file:", error);
    throw error;
  }
}
