import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign, Award, CheckCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Partners() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list(),
    initialData: [],
  });

  const config = settings[0] || {};

  const benefits = [
    {
      icon: DollarSign,
      title: "Comisiones Atractivas",
      description: "Gana por cada paciente que refieras a nuestro servicio"
    },
    {
      icon: TrendingUp,
      title: "Crecimiento Continuo",
      description: "Mayor demanda de equipos de calidad para tus pacientes"
    },
    {
      icon: Award,
      title: "Reconocimiento Profesional",
      description: "Forma parte de nuestra red de profesionales de confianza"
    },
    {
      icon: CheckCircle,
      title: "Beneficios Exclusivos",
      description: "Acceso a promociones especiales para tus pacientes"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Programa de Socios Médicos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Únete a nuestra red de profesionales y genera ingresos adicionales
        </p>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-sky-500 to-blue-600 text-white border-none shadow-2xl">
          <CardContent className="p-12 text-center">
            <Users className="w-20 h-20 mx-auto mb-6 text-white" />
            <h2 className="text-4xl font-bold mb-4">
              Conviértete en Socio
            </h2>
            <p className="text-lg text-sky-100 max-w-3xl mx-auto leading-relaxed">
              Recomienda nuestros equipos a tus pacientes post-vitrectomía y recibe comisiones 
              por cada renta. Un beneficio adicional para tu práctica profesional.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Benefits */}
      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-sky-100 hover:border-sky-300 transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl">{benefit.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* How it Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-3xl">¿Cómo funciona?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Regístrate",
                  desc: "Completa el proceso de registro con tus datos profesionales"
                },
                {
                  step: "2",
                  title: "Recomienda",
                  desc: "Proporciona tu código a los pacientes que necesiten equipos de reposo"
                },
                {
                  step: "3",
                  title: "Gana Comisiones",
                  desc: "Recibe tus ganancias por cada renta generada con tu código"
                }
              ].map((item, index) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-2xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">¿Tienes dudas?</h3>
            <p className="text-green-100 mb-6">
              Contáctanos por WhatsApp y con gusto te explicamos más detalles
            </p>
            <Button
              onClick={() => {
                const phone = config.phone_1?.replace(/\D/g, '') || '';
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Hola, me interesa el programa de socios médicos')}`, '_blank');
              }}
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-6 text-lg rounded-xl shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contactar por WhatsApp
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}