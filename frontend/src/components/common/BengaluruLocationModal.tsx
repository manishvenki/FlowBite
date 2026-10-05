import React from 'react';
import { MapPin, Check } from 'lucide-react';
import { Modal } from './Modal';
import { useLocationArea, BENGALURU_AREAS, BengaluruArea } from '../../context/LocationContext';

export const BengaluruLocationModal: React.FC = () => {
  const { area, setArea, isModalOpen, closeLocationModal } = useLocationArea();

  const handleSelect = (selectedArea: BengaluruArea) => {
    setArea(selectedArea);
    closeLocationModal();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeLocationModal}
      title="Select Your Delivery Area"
      description="Choose your neighborhood across Bengaluru, Karnataka for accurate delivery times and local kitchen menus."
      maxWidth="md"
    >
      <div className="pt-2 space-y-4">
        <div className="p-3 bg-sand/40 border border-sand-border/80 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-olive/15 text-olive flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-olive-dark block">Bengaluru, Karnataka, India</span>
            <span className="text-olive-dark/70">Delivering fresh artisanal food across top city hubs</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {BENGALURU_AREAS.map((a) => {
            const isSelected = area === a;
            return (
              <button
                key={a}
                type="button"
                onClick={() => handleSelect(a)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-olive text-[#FFFDF5] border-olive shadow-sm'
                    : 'bg-[#FFFDF5] text-olive-dark border-sand-border/80 hover:bg-sand/30 hover:border-olive/50'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight">{a}</span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? 'text-[#EDE4D3]' : 'text-olive-dark/60'
                    }`}
                  >
                    Bengaluru
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 shrink-0 text-[#FFFDF5]" />}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
