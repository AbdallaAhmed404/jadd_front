"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// تعريف شكل البيانات في المخزن
interface LanguageContextType {
  lang: 'en' | 'ar';
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // تغيير اللغة وتبديل اتجاه الصفحة (RTL/LTR)
  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook بسيط عشان نستخدمه في أي صفحة بسهولة
export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
};