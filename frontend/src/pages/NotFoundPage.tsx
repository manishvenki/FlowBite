import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="w-20 h-20 rounded-3xl bg-sand/60 flex items-center justify-center text-olive">
        <Compass className="w-10 h-10 animate-spin duration-1000" />
      </div>
      <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-olive-dark">
        404 — Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-olive-dark/70 max-w-md leading-relaxed">
        The table you are looking for has been cleared or moved. Return to the dining room to discover fresh kitchens.
      </p>
      <div className="pt-2">
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    </div>
  );
};
