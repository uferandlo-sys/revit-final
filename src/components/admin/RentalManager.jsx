import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Mail, Truck, Phone } from "lucide-react";
import { format } from "date-fns";

export default function RentalManager() {
  const [selectedRental, setSelectedRental] = useState(null);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [trackingData, setTrackingData] = useState({
    tracking_number: "",
    shipping_company: "",
    tracking_url: "",
    shipping_date: "",
    shipping_notes: ""
  });

  const queryClient = useQueryClient();

  const { data: rentals, isLoading } = useQuery({
    queryKey: ['rentals'],
    queryFn: () => base44.entities.Rental.list('-created_date'),
    initialData: [],
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list(),
    initialData: [],
  });

  const config = settings[0] || {};

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Rental.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      setShowTrackingDialog(false);
      setSelectedRental(null);
    },
  });

  const handleStatusChange = (rental, newStatus) => {
    updateMutation.mutate({
      id: rental.id,
      data: { ...rental, status: newStatus }
    });
  };

  const openTrackingDialog = (rental) => {
    setSelectedRental(rental);
    setTrackingData({
      tracking_number: rental.tracking_number || "",
      shipping_company: rental.shipping_company || "",
      tracking_url: rental.tracking_url || "",
      shipping_date: rental.shipping_date || "",
      shipping_notes: rental.shipping_notes || ""
    });
    setShowTrackingDialog(true);
  };

  const saveTracking = () => {
    if (!selectedRental) return;
    updateMutation.mutate({
      id: selectedRental.id,
      data: { ...selectedRental, ...trackingData }
    });
  };

  const sendInstructionsEmail = async (rental) => {
    if (!rental.client_email) {
      alert('El cliente no tiene email registrado');
      return;
    }

    try {
      await base44.integrations.Core.SendEmail({
        to: rental.client_email,
        subject: "Instrucciones de uso del equipo",
        from_name: config.company_name || "REVIT",
        body: `Hola ${rental.client_name},

Gracias por rentar con nosotros. Aquí están las instrucciones de uso del equipo:

${config.instructions_pdf_url ? `📄 Manual de instrucciones: ${config.instructions_pdf_url}` : ''}

Si tienes alguna duda, contáctanos por WhatsApp.

Saludos,
${config.company_name || 'REVIT'}`
      });

      updateMutation.mutate({
        id: rental.id,
        data: { ...rental, instructions_sent: true }
      });
      alert('Instrucciones enviadas');
    } catch (error) {
      alert('Error al enviar email');
    }
  };

  const sendDisinfectionEmail = async (rental) => {
    if (!rental.client_email) {
      alert('El cliente no tiene email registrado');
      return;
    }

    try {
      await base44.integrations.Core.SendEmail({
        to: rental.client_email,
        subject: "Instrucciones de desinfección del equipo",
        from_name: config.company_name || "REVIT",
        body: `Hola ${rental.client_name},

Aquí están las instrucciones para desinfectar el equipo antes de devolverlo:

${config.disinfection_pdf_url ? `📄 Instrucciones de desinfección: ${config.disinfection_pdf_url}` : ''}

Gracias por tu cuidado del equipo.

Saludos,
${config.company_name || 'REVIT'}`
      });

      updateMutation.mutate({
        id: rental.id,
        data: { ...rental, disinfection_instructions_sent: true }
      });
      alert('Instrucciones de desinfección enviadas');
    } catch (error) {
      alert('Error al enviar email');
    }
  };

  const statusColors = {
    pendiente: "bg-yellow-100 text-yellow-800",
    confirmado: "bg-blue-100 text-blue-800",
    enviado: "bg-purple-100 text-purple-800",
    en_uso: "bg-green-100 text-green-800",
    devuelto: "bg-gray-100 text-gray-800",
    cancelado: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Rentas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando...</p>
          ) : rentals.length === 0 ? (
            <p className="text-gray-500">No hay rentas registradas</p>
          ) : (
            <div className="space-y-4">
              {rentals.map((rental) => (
                <Card key={rental.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{rental.client_name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {rental.client_phone}
                        </p>
                        {rental.client_email && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {rental.client_email}
                          </p>
                        )}
                        <p className="text-sm mt-2">
                          <strong>Equipo:</strong> {rental.equipment_name}
                        </p>
                        <p className="text-sm">
                          <strong>Cirugía:</strong> {rental.surgery_date}
                        </p>
                        <p className="text-sm">
                          <strong>Días:</strong> {rental.rental_days}
                        </p>
                        <p className="text-sm">
                          <strong>Monto:</strong> ${rental.total_amount}
                        </p>
                        <p className="text-sm">
                          <strong>Estado:</strong> {rental.state}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">Estado de la Renta</Label>
                          <Select
                            value={rental.status}
                            onValueChange={(value) => handleStatusChange(rental, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendiente">Pendiente</SelectItem>
                              <SelectItem value="confirmado">Confirmado</SelectItem>
                              <SelectItem value="enviado">Enviado</SelectItem>
                              <SelectItem value="en_uso">En Uso</SelectItem>
                              <SelectItem value="devuelto">Devuelto</SelectItem>
                              <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Badge className={statusColors[rental.status]}>
                          {rental.status}
                        </Badge>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openTrackingDialog(rental)}
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Rastreo
                          </Button>
                          {rental.client_email && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendInstructionsEmail(rental)}
                                disabled={rental.instructions_sent}
                              >
                                <Mail className="w-4 h-4 mr-1" />
                                {rental.instructions_sent ? '✓ Enviado' : 'Instrucciones'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendDisinfectionEmail(rental)}
                                disabled={rental.disinfection_instructions_sent}
                              >
                                <Mail className="w-4 h-4 mr-1" />
                                {rental.disinfection_instructions_sent ? '✓ Enviado' : 'Desinfección'}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {rental.additional_notes && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded">
                        <p className="text-sm"><strong>Notas:</strong> {rental.additional_notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información de Rastreo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Número de Guía</Label>
              <Input
                value={trackingData.tracking_number}
                onChange={(e) => setTrackingData({ ...trackingData, tracking_number: e.target.value })}
              />
            </div>
            <div>
              <Label>Empresa de Paquetería</Label>
              <Input
                value={trackingData.shipping_company}
                onChange={(e) => setTrackingData({ ...trackingData, shipping_company: e.target.value })}
              />
            </div>
            <div>
              <Label>URL de Rastreo</Label>
              <Input
                value={trackingData.tracking_url}
                onChange={(e) => setTrackingData({ ...trackingData, tracking_url: e.target.value })}
              />
            </div>
            <div>
              <Label>Fecha de Envío</Label>
              <Input
                type="date"
                value={trackingData.shipping_date}
                onChange={(e) => setTrackingData({ ...trackingData, shipping_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Notas de Envío</Label>
              <Textarea
                value={trackingData.shipping_notes}
                onChange={(e) => setTrackingData({ ...trackingData, shipping_notes: e.target.value })}
                rows={3}
              />
            </div>
            <Button onClick={saveTracking} disabled={updateMutation.isPending}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}