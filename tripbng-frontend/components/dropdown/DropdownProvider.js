// DropdownProvider.js
import React, { createContext, useState } from 'react';

export const DropdownContext = createContext();

export const DropdownProvider = ({ children }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <DropdownContext.Provider value={{ openDropdown, setOpenDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
};
