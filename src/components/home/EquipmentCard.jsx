import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Phone, AlertCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EquipmentCard({ equipment, onContact, index }) {
  return (
    <div>
      <Card className="overflow-hidden border-2 border-sky-100 group">
        <div className="relative">
          {equipment.image_url ? (
            <img 
              src={equipment.image_url} 
              alt={equipment.name}
              loading="lazy"
              className="w-full h-48 sm:h-64 object-cover"
            />
          ) : (
            <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-sky-200 to-blue-300 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">{equipment.name?.[0]}</span>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-sky-200">
            <div className="text-xs text-gray-600 font-medium">Precio</div>
            <div className="text-2xl font-bold text-sky-600">
              ${equipment.price}
            </div>
          </div>

          {/* Availability Badge */}
          <div className="absolute top-4 left-4">
            {equipment.available ? (
              <Badge className="bg-green-500 text-white flex items-center gap-1 px-3 py-1">
                <CheckCircle className="w-3 h-3" />
                Disponible
              </Badge>
            ) : (
              <Badge className="bg-red-500 text-white flex items-center gap-1 px-3 py-1">
                <AlertCircle className="w-3 h-3" />
                Rentado
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {equipment.name}
            </h3>
            <p className="text-gray-600">
              {equipment.description}
            </p>
          </div>

          {equipment.features && equipment.features.length > 0 && (
            <div className="space-y-2">
              {equipment.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Link to={createPageUrl("Rental")} className="flex-1">
              <Button
                disabled={!equipment.available}
                className={`w-full py-4 sm:py-6 rounded-xl font-bold shadow-lg text-sm sm:text-base ${
                  equipment.available
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {equipment.available ? "Rentar en App" : "No Disponible"}
              </Button>
            </Link>
            
            {equipment.available && (
              <Button
                onClick={() => onContact(equipment.name)}
                variant="outline"
                className="py-4 sm:py-6 px-4 rounded-xl font-bold border-2 border-green-500 text-green-600 hover:bg-green-50 w-full sm:w-auto"
              >
                <Phone className="w-5 h-5" />
                <span className="sm:hidden ml-2">WhatsApp</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}