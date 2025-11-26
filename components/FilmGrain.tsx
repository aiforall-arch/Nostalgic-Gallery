import React from 'react';

export const FilmGrain: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.12] mix-blend-overlay">
      <div className="absolute inset-0 h-[200%] w-[200%] animate-grain bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise_pattern_with_intensity_0.5.png')] bg-repeat" />
    </div>
  );
};
