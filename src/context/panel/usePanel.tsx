
import React, { createContext, useContext, useState, ReactNode } from 'react';

type PanelPosition = 'top' | 'left';

interface PanelContextType {
  position: PanelPosition;
  setPosition: (pos: PanelPosition) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider: React.FC<{ children: ReactNode  }> = ({ children }) => {
  const [position, setPosition] = useState<PanelPosition>('left');

  return (
    <PanelContext.Provider value={{ position, setPosition }}>
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
};
