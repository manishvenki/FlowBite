import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const BENGALURU_AREAS = [
  'HSR Layout',
  'Indiranagar',
  'Koramangala',
  'Whitefield',
  'Jayanagar',
  'JP Nagar',
  'Malleshwaram',
  'Bellandur',
  'Electronic City',
  'MG Road',
  'Rajajinagar',
  'Banashankari',
  'Marathahalli',
  'Hebbal',
  'Yelahanka',
] as const;

export type BengaluruArea = typeof BENGALURU_AREAS[number];

interface LocationContextType {
  area: BengaluruArea;
  city: string;
  state: string;
  country: string;
  setArea: (area: BengaluruArea) => void;
  isModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'biteflow_customer_bengaluru_area';

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [area, setAreaState] = useState<BengaluruArea>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && BENGALURU_AREAS.includes(saved as BengaluruArea)) {
        return saved as BengaluruArea;
      }
    } catch {
      // fallback
    }
    return 'HSR Layout';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const setArea = (newArea: BengaluruArea) => {
    setAreaState(newArea);
    try {
      localStorage.setItem(STORAGE_KEY, newArea);
    } catch {
      // ignore
    }
  };

  const openLocationModal = () => setIsModalOpen(true);
  const closeLocationModal = () => setIsModalOpen(false);

  return (
    <LocationContext.Provider
      value={{
        area,
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        setArea,
        isModalOpen,
        openLocationModal,
        closeLocationModal,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationArea = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationArea must be used within a LocationProvider');
  }
  return context;
};
