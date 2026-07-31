import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, Clock, Package } from "lucide-react";
import { format } from "date-fns";

export default function VerSolicitudes() {
  const [copiedId, setCopiedId] = useState(null);

  const { data: rentals, isLoading } = useQuery({
    queryKey: ['recent-rentals'],
    queryFn: () => base44.entities.Rental.list('-created_date', 50),
    initialData: [],
    refetchInterval: 30000,
  });

  const copyRentalInfo = (rental) => {
    const message = `🆕 NUEVA SOLICITUD DE RENTA

👤 Nombre: ${rental.client_name}
📱 Tel: ${rental.client_phone}
📍 Zona: ${rental.state}

📦 Paquete: ${rental.equipment_name}
💰 Precio: $${rental.total_amount} + IVA
📅 Fecha inicio: ${rental.rental_start || 'No especificada'}
⏱️ Días: ${rental.rental_days || 'No especificado'}

${rental.additional_notes ? `📝 Comentarios: ${rental.additional_notes}\n\n` : ''}🆔 ID: ${rental.id}`;

    navigator.clipboard.writeText(message);
    setCopiedId(rental.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmado: 'bg-blue-100 text-blue-800 border-blue-300',
      enviado: 'bg-purple-100 text-purple-800 border-purple-300',
      en_uso: 'bg-green-100 text-green-800 border-green-300',
      devuelto: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendiente: 'Pendiente',
      confirmado: 'Confirmado',
      enviado: 'Enviado',
      en_uso: 'En Uso',
      devuelto: 'Devuelto',
      cancelado: 'Cancelado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Renta</h1>
          <p className="text-gray-600 mt-1">Últimas 50 solicitudes recibidas</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : rentals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay solicitudes aún
            </h3>
            <p className="text-gray-500">
              Las solicitudes de renta aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rentals.map((rental) => (
            <Card key={rental.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 mb-2">
                      {rental.client_name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(rental.status)}`}>
                        {getStatusLabel(rental.status)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300">
                        {rental.equipment_name}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => copyRentalInfo(rental)}
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    {copiedId === rental.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">📱 Teléfono:</span>
                      <a href={`https://wa.me/52${(rental.client_phone || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600">
                        {rental.client_phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">📍 Zona:</span>
                      {rental.state}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">💰 Precio:</span>
                      ${rental.total_amount} + IVA
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">📅 Fecha inicio:</span>
                      {rental.rental_start ? format(new Date(rental.rental_start), 'dd/MM/yyyy') : 'No especificada'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">⏱️ Días:</span>
                      {rental.rental_days || 'No especificado'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span className="text-gray-500">
                        {format(new Date(rental.created_date), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
                {rental.additional_notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-700 text-sm mb-1">📝 Comentarios:</p>
                    <p className="text-gray-600 text-sm">{rental.additional_notes}</p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">🆔 ID: {rental.id}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}