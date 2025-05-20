
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUserPreference } from '../user/UserPreference';

type PanelPosition = 'top' | 'left';

interface PanelContextType {
  position: PanelPosition;
  setPosition: (pos: PanelPosition) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider: React.FC<{ children: ReactNode  }> = ({ children }) => {
  const {userPreference}= useUserPreference();
  const [position, setPosition] = useState<PanelPosition>("left");

  useEffect(()=>{
    if(userPreference && typeof userPreference.isLeftMenu ==="boolean"){
      setPosition(userPreference.isLeftMenu ? "left" : "top");
    }
  },[userPreference])

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
