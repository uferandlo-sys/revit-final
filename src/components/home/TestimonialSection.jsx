import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export default function TestimonialSection({ testimonials }) {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p className="text-lg text-gray-600">
          Experiencias reales de pacientes satisfechos
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id}>
            <Card className="h-full border-2 border-sky-100">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-sky-200" />
                  <p className="text-gray-700 italic pl-6 leading-relaxed">
                    {testimonial.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-sky-100">
                  <p className="font-bold text-gray-900">{testimonial.client_name}</p>
                  {testimonial.equipment_name && (
                    <p className="text-sm text-gray-500">Rentó: {testimonial.equipment_name}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}