"use client";

import React, { useState, createContext, useContext } from 'react';
import CategoriesSlider from './CategoriesSlider'; // تأكد من مسار الاستيراد الصحيح

interface CategoriesContextType {
  isOpen: boolean;
  toggleCategories: () => void;
  openCategories: () => void;
  closeCategories: () => void;
}

const CategoriesContext = createContext<CategoriesContextType>({ 
  isOpen: false, 
  toggleCategories: () => {}, 
  openCategories: () => {},
  closeCategories: () => {}
});

export const useCategories = () => useContext(CategoriesContext);

export default function CategoriesDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategories = () => setIsOpen(!isOpen);
  const openCategories = () => setIsOpen(true);
  const closeCategories = () => setIsOpen(false);

  return (
    <CategoriesContext.Provider value={{ isOpen, toggleCategories, openCategories, closeCategories }}>
      {children}
      {/* تمرير الحالة والمكون المسؤول عن إغلاق السلايدر */}
      <CategoriesSlider isOpen={isOpen} onClose={closeCategories} />
    </CategoriesContext.Provider>
  );
}