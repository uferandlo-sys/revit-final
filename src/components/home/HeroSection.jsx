import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle } from "lucide-react";

export default function HeroSection({ config, onContact }) {
  const heroStyle = config.hero_image_url ? {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95)), url(${config.hero_image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white/10 via-sky-50/10 to-blue-100/10 backdrop-blur-sm rounded-3xl shadow-2xl" style={heroStyle}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative p-8 md:p-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            {config.hero_title || "Recuperación Segura Post-Vitrectomía"}
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            {config.hero_subtitle || "Equipos de reposo especializados para tu recuperación. Envío a toda la república con instrucciones completas."}
          </p>

          <div className="space-y-3 max-w-xl mx-auto">
            {[
              "Envío 3 días antes de tu cirugía",
              "Instrucciones detalladas incluidas",
              "Atención personalizada por WhatsApp"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => onContact()}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl font-bold shadow-xl active:scale-95 transition-all duration-200 w-full sm:w-auto"
          >
            <Phone className="w-5 h-5 mr-2" />
            Contactar por WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}