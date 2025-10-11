import React from 'react';
import { Building2 } from 'lucide-react';
import logo from '../../assets/um6p-logo.png';

const BrandingSection = () => {
  return (
    <div className="bg-[#012D5A] text-white md:w-5/12 p-8 flex flex-col justify-center">
      <div className="max-w-md mx-auto space-y-8">
        <div className="bg-white p-4 rounded-lg inline-block">
          <img
            src={logo}            
            alt="UM6P Logo"
            className="h-16 w-auto object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Portail d'achat UM6P
          </h2>
          <p className="opacity-80 leading-relaxed">
            Gérez efficacement vos achats et approvisionnements universitaires en un seul endroit.
          </p>
        </div>
        
        <div className="bg-[#023e7d]/30 rounded-xl p-5 backdrop-blur-sm">
          <p className="text-sm leading-relaxed">
            "L'excellence dans la gestion des ressources est la clé de notre réussite collective."
          </p>
          <div className="flex items-center mt-4 space-x-2">
            <Building2 className="h-5 w-5 opacity-75" />
            <p className="text-sm font-medium">Département des Achats UM6P</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingSection;