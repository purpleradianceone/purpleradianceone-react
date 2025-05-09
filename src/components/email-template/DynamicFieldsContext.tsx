/* eslint-disable react-refresh/only-export-components */
// DynamicFieldsContext.tsx
import React, { createContext, useContext } from "react";

export type DynamicFieldOption = { label: string; value: string };

export const DynamicFieldsContext = createContext<DynamicFieldOption[]>([]);

export const useDynamicFields = () => useContext(DynamicFieldsContext);

export const DynamicFieldsProvider: React.FC<{
  value: DynamicFieldOption[];
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <DynamicFieldsContext.Provider value={value}>
      {children}
    </DynamicFieldsContext.Provider>
  );
};
