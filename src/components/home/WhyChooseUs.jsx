import React from "react";
import { Truck, HeadphonesIcon, Award, MapPin } from "lucide-react";

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "al área Metropolitana de Nuevo León"
    },
    {
      icon: HeadphonesIcon,
      title: "Soporte 24/7",
      description: "Atención inmediata por WhatsApp"
    },
    {
      icon: Award,
      title: "Calidad Garantizada",
      description: "Desinfección y preparación profesional"
    },
    {
      icon: MapPin,
      title: "Cobertura Total",
      description: "en todo México"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-sky-900 to-blue-900 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">¿Por qué elegirnos?</h2>
        <p className="text-xl text-sky-200">
          Tu recuperación es nuestra prioridad
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div className="w-14 h-14 bg-sky-400 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-sky-100">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}