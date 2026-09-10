"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SITE_SETTINGS,
  isLoading: true,
  refreshSettings: async () => {},
  updateSettings: async () => false,
  resetSettings: async () => false,
});

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: SiteSettings;
}) {
  const [settings, setSettings] = useState<SiteSettings>(
    initialSettings || DEFAULT_SITE_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(!initialSettings);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.error("Error fetching site settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating site settings:", err);
      return false;
    }
  };

  const resetSettings = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error resetting site settings:", err);
      return false;
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
