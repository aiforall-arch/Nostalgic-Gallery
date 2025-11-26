import React from 'react';
import { ArrowRight, Film } from 'lucide-react';
import { HERO_IMAGE } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Hero Background with Parallax-ish feel */}
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_IMAGE} 
          alt="Friends laughing" 
          className="h-full w-full object-cover opacity-90 sepia-[0.3] filter transition-transform duration-[20s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl animate-slide-up">
          <div className="mb-6 flex items-center gap-2 text-sienna opacity-80">
            <Film size={20} />
            <span className="font-sans text-sm font-medium uppercase tracking-widest">Nostalgic Gallery</span>
          </div>
          
          <h1 className="mb-6 font-serif text-5xl font-medium leading-tight text-warmGray md:text-7xl lg:text-8xl">
            Every second <br />
            <span className="italic text-sienna">matters.</span>
          </h1>

          <p className="mb-8 max-w-lg font-serif text-lg leading-relaxed text-warmGray/80 md:text-xl">
            This is a tiny refuge of soft light and shared smiles. Here we collect short films and photos — little time capsules stitched from fleeting moments. Keep them close, for life is one journey and every second we borrow is worth remembering.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button 
              onClick={onEnter}
              className="group flex items-center gap-3 bg-sienna px-8 py-4 font-sans text-white transition-all duration-300 hover:bg-sienna/90 hover:pl-10"
            >
              Enter the Gallery
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button className="px-8 py-4 font-sans text-sienna transition-colors hover:text-warmGray">
              About this project
            </button>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-6 left-6 z-10 text-sm text-warmGray/50 md:left-12">
        © 2024 Friends & Co.
      </footer>
    </div>
  );
};
