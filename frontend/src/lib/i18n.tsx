import React, { createContext, useContext, useState, ReactNode } from "react";
import { LocalizedText } from "@/api-client/generated/api.schemas";

export type Language = "pt" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: LocalizedText | string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("blindkiss_lang");
    return (saved as Language) || "pt";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("blindkiss_lang", lang);
  };

  const t = (text: LocalizedText | string | null | undefined): string => {
    if (!text) return "";
    if (typeof text === "string") return text;
    // Fallback to PT if EN is missing
    return text[language] || text.pt || "";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
