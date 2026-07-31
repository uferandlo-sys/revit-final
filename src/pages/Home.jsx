import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Phone, Package, Shield, Clock, User, MapPin, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import EquipmentCard from "../components/home/EquipmentCard.jsx";
import TestimonialSection from "../components/home/TestimonialSection.jsx";

export default function Home() {
  const [equipo_a_rentar, setEquipo_a_rentar] = useState("");
  const [precio_paquete, setPrecio_paquete] = useState(0);
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    city: "",
    rental_start: "",
    additional_notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");



  const { data: equipment, isLoading: equipmentLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list(),
    initialData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list(),
    initialData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.filter({ approved: true }),
    initialData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: () => base44.entities.Package.filter({ active: true }),
    initialData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => base44.entities.TeamMember.filter({ active: true }),
    initialData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const config = settings[0] || {};

  const handleWhatsAppContact = (equipmentName = "") => {
    const message = equipmentName 
      ? `Hola, me interesa rentar el equipo: ${equipmentName}`
      : "Hola, me interesa información sobre la renta de equipos";
    const phone = config.phone_1?.replace(/\D/g, '') || '';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const saveRentalSilently = async (data) => {
    try {
      await base44.entities.Rental.create(data);
    } catch (error) {
      console.error('Error al guardar renta (silencioso):', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    if (!equipo_a_rentar) errors.paquete = "Selecciona un paquete";
    if (!formData.client_name.trim()) errors.client_name = "Nombre es obligatorio";
    if (!formData.client_phone.trim()) errors.client_phone = "Teléfono es obligatorio";
    if (!formData.city.trim()) errors.city = "Ciudad/Zona es obligatorio";
    if (!formData.rental_start) errors.rental_start = "Fecha de inicio es obligatoria";
    if (!formData.referring_doctor?.trim()) errors.referring_doctor = "Nombre del doctor es obligatorio";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setButtonPressed(true);
    setTimeout(() => setButtonPressed(false), 150);
    
    const fechaFormato = formData.rental_start ? new Date(formData.rental_start).toLocaleDateString('es-MX') : '';
    
    let message = `✅ SOLICITUD DE RENTA – VITRECTOMÍA

Nombre: ${formData.client_name}
Teléfono: ${formData.client_phone}
Ciudad/Zona: ${formData.city}
Paquete: ${equipo_a_rentar}`;
    
    if (fechaFormato) message += `\nFecha: ${fechaFormato}`;
    if (formData.referring_doctor) message += `\nDoctor que refirió: ${formData.referring_doctor}`;
    if (formData.additional_notes) message += `\nNotas: ${formData.additional_notes}`;
    
    setConfirmMessage(message);
    setShowConfirmModal(true);
    
    saveRentalSilently({
      equipment_id: equipo_a_rentar,
      equipment_name: equipo_a_rentar,
      total_amount: precio_paquete,
      client_name: formData.client_name,
      client_phone: formData.client_phone,
      state: formData.city,
      rental_start: formData.rental_start,
      rental_days: 7,
      additional_notes: formData.additional_notes,
      status: "pendiente",
      payment_status: "pendiente"
    });
    
    setSubmitted(true);
    setFormData({
      client_name: "",
      client_phone: "",
      city: "",
      rental_start: "",
      additional_notes: ""
    });
    setEquipo_a_rentar("");
    setPrecio_paquete(0);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePackageSelect = (packageName) => {
    setEquipo_a_rentar(packageName);
    const selectedPkg = packages.find(pkg => pkg.name === packageName);
    if (selectedPkg) {
      setPrecio_paquete(selectedPkg.price);
    }
  };

  const availableCount = equipment.filter(eq => eq.available).length;
  const availableEquipment = equipment.filter(eq => eq.available);
  
  const isFormComplete = equipo_a_rentar && formData.client_name && formData.client_phone && formData.city && formData.rental_start;

  const copyMessage = () => {
    navigator.clipboard.writeText(confirmMessage);
    alert('✅ Mensaje copiado al portapapeles');
  };

  const sendWhatsAppTo = (phone) => {
    const encodedMessage = encodeURIComponent(confirmMessage);
    window.open(`https://wa.me/52${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="space-y-16">
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-green-700">✅ Listo. Tu solicitud está preparada</DialogTitle>
            <DialogDescription className="text-gray-700">
              Tu solicitud está lista para enviarse por WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button
              onClick={() => sendWhatsAppTo('8141955443')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-semibold"
            >
              <Phone className="w-5 h-5 mr-2" />
              Enviar por WhatsApp
            </Button>
            <Button
              onClick={copyMessage}
              variant="outline"
              className="w-full py-4 text-base font-semibold"
            >
              📋 Copiar Mensaje
            </Button>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-sm text-gray-700 mb-3">También envíalo a:</p>
              <div className="space-y-2">
                <Button
                  onClick={() => sendWhatsAppTo('8128727402')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Enviar a 8114111959
                </Button>
                <Button
                  onClick={() => sendWhatsAppTo('8134474140')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Enviar a 8134474140
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Equipos REVIT Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Equipos REVIT
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Equipos profesionales para tu recuperación post-vitrectomía
          </p>
        </div>

        {/* Package Images Gallery */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6901c9d1bd4be7f42a2bce19/24422662e_file_000000007870722fbf8533ec3af6fb4b.png"
              alt="Paquete 1"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6901c9d1bd4be7f42a2bce19/e105c4c23_file_00000000dc8471f589e715fd883f0391.png"
              alt="Paquete 2"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6901c9d1bd4be7f42a2bce19/780d1bd07_file_00000000c1a071f8939197c5367a17f6.png"
              alt="Paquete 3"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {equipmentLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                <div className="bg-gray-200 h-48 rounded-xl mb-4" />
                <div className="bg-gray-200 h-6 w-32 rounded mb-2" />
                <div className="bg-gray-200 h-4 w-24 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {equipment.slice(0, 3).map((item) => (
              <Card key={item.id} className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                {/* Image Gallery */}
                <div className="relative bg-gray-50">
                  {item.image_url || (item.usage_images && item.usage_images.length > 0) ? (
                    <div className="relative h-64">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src={item.usage_images[0]} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Additional images gallery - max 4 */}
                      {item.usage_images && item.usage_images.length > 0 && (
                        <div className="absolute bottom-2 left-2 right-2 flex gap-1 overflow-x-auto">
                          {item.usage_images.slice(0, 4).map((img, idx) => (
                            <img 
                              key={idx}
                              src={img}
                              alt={`${item.name} - ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm flex-shrink-0"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Package className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Equipment Name */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-2 border-t border-gray-100">
                    <span className="text-3xl font-bold text-sky-600">
                      ${item.price}
                    </span>
                    <span className="text-sm text-gray-500">MXN / renta</span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        document.getElementById('rentas')?.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(() => {
                          document.getElementById('client_name')?.focus();
                        }, 500);
                      }}
                      disabled={!item.available}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-150 active:scale-[0.98] active:shadow-md ${
                        item.available
                          ? "bg-sky-600 hover:bg-sky-700 text-white shadow-[0_4px_0_0_rgba(3,105,161,1)] active:shadow-[0_1px_0_0_rgba(3,105,161,1)] active:translate-y-[3px]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {item.available ? "Solicitar Renta" : "No Disponible"}
                    </Button>

                    {item.available && (
                      <Button
                        onClick={() => handleWhatsAppContact(item.name)}
                        variant="outline"
                        className="w-full py-3 rounded-lg font-semibold border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Packages Section */}
      {packages.length > 0 && (
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Paquetes
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Opciones completas para tu recuperación
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="bg-white/50 backdrop-blur-sm border-2 border-sky-200 shadow-xl hover:shadow-2xl transition-all">
                {pkg.image_url && (
                  <div className="relative h-64 overflow-hidden rounded-t-xl">
                    <img 
                      src={pkg.image_url} 
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{pkg.name}</CardTitle>
                  <p className="text-gray-600">{pkg.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-sky-600">
                    ${pkg.price}
                  </div>
                  
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleWhatsAppContact(pkg.name)}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 py-6 rounded-xl font-bold shadow-lg"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Contratar Paquete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Leyenda de comunicación */}
      <section className="max-w-3xl mx-auto -mt-8">
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 text-center space-y-2">
          <p className="text-gray-700 text-sm sm:text-base">
            Agradecemos que toda comunicación se realice preferentemente por WhatsApp o mediante el llenado del formulario de Información de Renta.
          </p>
          <p className="text-gray-700 text-sm sm:text-base">
            Para cualquier duda adicional, favor de enviar mensaje de WhatsApp a los mismos contactos.
          </p>
        </div>
      </section>

      {/* Información de Renta - Sección Única */}
      <section id="rentas" className="scroll-mt-8">
        <div className="max-w-3xl mx-auto">
          {submitted && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <AlertDescription className="text-green-800 text-lg font-semibold">
                ✅ Solicitud enviada. En breve te contactamos.
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-2 border-sky-200 shadow-2xl bg-white/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50">
              <CardTitle className="text-2xl md:text-3xl">Información de Renta</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector de Paquete */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-6">Selecciona Tu Paquete</h3>
                  
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        handlePackageSelect('Paquete 1');
                        setFormErrors({...formErrors, paquete: ''});
                      }}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        equipo_a_rentar === 'Paquete 1' 
                          ? 'border-sky-500 bg-sky-50 shadow-lg' 
                          : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Paquete 1</span>
                        <span className="text-2xl font-bold text-sky-600">$5500</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handlePackageSelect('Paquete 2');
                        setFormErrors({...formErrors, paquete: ''});
                      }}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        equipo_a_rentar === 'Paquete 2' 
                          ? 'border-sky-500 bg-sky-50 shadow-lg' 
                          : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Paquete 2</span>
                        <span className="text-2xl font-bold text-sky-600">$2500</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handlePackageSelect('Paquete 3');
                        setFormErrors({...formErrors, paquete: ''});
                      }}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        equipo_a_rentar === 'Paquete 3' 
                          ? 'border-sky-500 bg-sky-50 shadow-lg' 
                          : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Paquete 3</span>
                        <span className="text-2xl font-bold text-sky-600">$4000</span>
                      </div>
                    </button>
                  </div>
                  {formErrors.paquete && (
                    <p className="text-red-600 text-sm mt-2">⚠️ {formErrors.paquete}</p>
                  )}

                  {equipo_a_rentar && precio_paquete > 0 && (
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-300 rounded-xl p-6 mt-4">
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        Elegiste: <span className="text-sky-600">{equipo_a_rentar}</span>
                      </p>
                      <p className="text-3xl font-bold text-sky-600">
                        Precio: ${precio_paquete} <span className="text-lg text-gray-600">+ IVA</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-3">
                        <span className="font-semibold">Nota:</span> Fuera del Área Monterrey + costo de envío
                      </p>
                    </div>
                  )}
                </div>

                {/* Formulario */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="client_name" className="text-base">Nombre Completo *</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => {
                        setFormData({...formData, client_name: e.target.value});
                        setFormErrors({...formErrors, client_name: ''});
                      }}
                      placeholder="Tu nombre completo"
                      className={`h-11 ${formErrors.client_name ? 'border-red-500' : ''}`}
                    />
                    {formErrors.client_name && (
                      <p className="text-red-600 text-sm">⚠️ {formErrors.client_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client_phone" className="text-base">Teléfono *</Label>
                    <Input
                      id="client_phone"
                      type="tel"
                      value={formData.client_phone}
                      onChange={(e) => {
                        setFormData({...formData, client_phone: e.target.value});
                        setFormErrors({...formErrors, client_phone: ''});
                      }}
                      placeholder="8112345678"
                      className={`h-11 ${formErrors.client_phone ? 'border-red-500' : ''}`}
                    />
                    {formErrors.client_phone && (
                      <p className="text-red-600 text-sm">⚠️ {formErrors.client_phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-base">Ciudad / Zona *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({...formData, city: e.target.value});
                        setFormErrors({...formErrors, city: ''});
                      }}
                      placeholder="Ej: Nuevo León"
                      className={`h-11 ${formErrors.city ? 'border-red-500' : ''}`}
                    />
                    {formErrors.city && (
                      <p className="text-red-600 text-sm">⚠️ {formErrors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rental_start" className="text-base">Fecha de Inicio *</Label>
                    <Input
                      id="rental_start"
                      type="date"
                      value={formData.rental_start}
                      onChange={(e) => {
                        setFormData({...formData, rental_start: e.target.value});
                        setFormErrors({...formErrors, rental_start: ''});
                      }}
                      className={`h-11 ${formErrors.rental_start ? 'border-red-500' : ''}`}
                    />
                    {formErrors.rental_start && (
                      <p className="text-red-600 text-sm">⚠️ {formErrors.rental_start}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referring_doctor" className="text-base">Nombre del Doctor que lo refirió *</Label>
                    <Input
                      id="referring_doctor"
                      value={formData.referring_doctor || ""}
                      onChange={(e) => {
                        setFormData({...formData, referring_doctor: e.target.value});
                        setFormErrors({...formErrors, referring_doctor: ''});
                      }}
                      placeholder="Nombre del doctor"
                      className={`h-11 ${formErrors.referring_doctor ? 'border-red-500' : ''}`}
                    />
                    {formErrors.referring_doctor && (
                      <p className="text-red-600 text-sm">⚠️ {formErrors.referring_doctor}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional_notes" className="text-base">Comentarios (opcional)</Label>
                    <Textarea
                      id="additional_notes"
                      value={formData.additional_notes}
                      onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                      placeholder="Alguna nota o pregunta adicional..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Botón Principal */}
                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-b from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 py-6 text-lg font-bold rounded-xl transition-all duration-150 ${
                    buttonPressed 
                      ? 'shadow-[0_2px_0_0_rgba(3,105,161,1)] translate-y-[6px] scale-[0.98]' 
                      : 'shadow-[0_8px_0_0_rgba(3,105,161,1)]'
                  }`}
                  style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
                >
                  Solicitar Renta
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>



      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Profesionales comprometidos con tu recuperación
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-white/50 backdrop-blur-sm border-2 border-sky-200 shadow-xl hover:shadow-2xl transition-all text-center">
                <CardHeader>
                  {member.image_url ? (
                    <img 
                      src={member.image_url} 
                      alt={member.name}
                      className="w-40 h-40 object-cover rounded-full mx-auto mb-4 border-4 border-sky-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gradient-to-br from-sky-200 to-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-sky-200 shadow-lg">
                      <span className="text-5xl text-white font-bold">{member.name?.[0]}</span>
                    </div>
                  )}
                  <CardTitle className="text-2xl text-gray-900">{member.name}</CardTitle>
                  <p className="text-sky-600 font-semibold text-lg">{member.role}</p>
                </CardHeader>
                {member.description && (
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && <TestimonialSection testimonials={testimonials} />}



      {/* Comments Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Déjanos tu Comentario
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Tu opinión es muy importante para nosotros
          </p>
        </div>

        <Card className="max-w-3xl mx-auto border-2 border-sky-200 shadow-xl bg-white/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                client_name: formData.get('name'),
                comment: formData.get('comment'),
                rating: parseInt(formData.get('rating')),
                equipment_name: formData.get('equipment')
              };
              base44.entities.Testimonial.create(data).then(() => {
                alert('¡Gracias por tu comentario! Será revisado antes de publicarse.');
                e.target.reset();
              });
            }} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipo Rentado</Label>
                <Input
                  id="equipment"
                  name="equipment"
                  placeholder="Ej: Paquete 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Calificación *</Label>
                <Select name="rating" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Muy Bueno</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Bueno</SelectItem>
                    <SelectItem value="2">⭐⭐ Regular</SelectItem>
                    <SelectItem value="1">⭐ Necesita Mejorar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comentario *</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  required
                  placeholder="Cuéntanos tu experiencia con nuestros equipos..."
                  rows={5}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 py-6 text-lg rounded-xl shadow-lg"
              >
                Enviar Comentario
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Tu comentario será revisado antes de publicarse
              </p>
            </form>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}