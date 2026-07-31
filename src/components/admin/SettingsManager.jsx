import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload } from "lucide-react";

export default function SettingsManager() {
  const [formData, setFormData] = useState({
    company_name: "",
    phone_1: "",
    phone_2: "",
    logo_url: "",
    instructions_pdf_url: "",
    disinfection_pdf_url: "",
    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",
    vitrectomy_info: "",
    care_agreement_text: "",
    primary_color: "#0ea5e9",
    secondary_color: "#3b82f6",
    monthly_membership_price: 500,
    days_advance_outside_nl: 3
  });
  const [uploading, setUploading] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list(),
    initialData: [],
  });

  useEffect(() => {
    if (settings && settings.length > 0) {
      const config = settings[0];
      setSettingsId(config.id);
      setFormData({
        company_name: config.company_name || "",
        phone_1: config.phone_1 || "",
        phone_2: config.phone_2 || "",
        logo_url: config.logo_url || "",
        instructions_pdf_url: config.instructions_pdf_url || "",
        disinfection_pdf_url: config.disinfection_pdf_url || "",
        hero_title: config.hero_title || "",
        hero_subtitle: config.hero_subtitle || "",
        hero_image_url: config.hero_image_url || "",
        vitrectomy_info: config.vitrectomy_info || "",
        care_agreement_text: config.care_agreement_text || "",
        primary_color: config.primary_color || "#0ea5e9",
        secondary_color: config.secondary_color || "#3b82f6",
        monthly_membership_price: config.monthly_membership_price || 500,
        days_advance_outside_nl: config.days_advance_outside_nl || 3
      });
    }
  }, [settings]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Settings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Configuración guardada');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Settings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Configuración actualizada');
    },
  });

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, [field]: result.file_url });
    } catch (error) {
      alert("Error subiendo archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (settingsId) {
      updateMutation.mutate({ id: settingsId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración General</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre de la Empresa</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Teléfono Principal</Label>
              <Input
                value={formData.phone_1}
                onChange={(e) => setFormData({ ...formData, phone_1: e.target.value })}
              />
            </div>
            <div>
              <Label>Teléfono Secundario</Label>
              <Input
                value={formData.phone_2}
                onChange={(e) => setFormData({ ...formData, phone_2: e.target.value })}
              />
            </div>
            <div>
              <Label>Días de Anticipación (Fuera de NL)</Label>
              <Input
                type="number"
                value={formData.days_advance_outside_nl}
                onChange={(e) => setFormData({ ...formData, days_advance_outside_nl: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label>Logo de la Empresa</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo_url')}
              disabled={uploading}
            />
            {formData.logo_url && (
              <img src={formData.logo_url} alt="Logo" className="mt-2 h-16" />
            )}
          </div>

          <div>
            <Label>Título Principal (Hero)</Label>
            <Input
              value={formData.hero_title}
              onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
            />
          </div>

          <div>
            <Label>Subtítulo (Hero)</Label>
            <Textarea
              value={formData.hero_subtitle}
              onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label>Imagen de Fondo (Hero)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'hero_image_url')}
              disabled={uploading}
            />
            {formData.hero_image_url && (
              <img src={formData.hero_image_url} alt="Hero" className="mt-2 h-32" />
            )}
          </div>

          <div>
            <Label>PDF Instrucciones de Uso</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, 'instructions_pdf_url')}
              disabled={uploading}
            />
            {formData.instructions_pdf_url && (
              <a href={formData.instructions_pdf_url} target="_blank" className="text-sm text-sky-600">
                Ver PDF
              </a>
            )}
          </div>

          <div>
            <Label>PDF Instrucciones de Desinfección</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, 'disinfection_pdf_url')}
              disabled={uploading}
            />
            {formData.disinfection_pdf_url && (
              <a href={formData.disinfection_pdf_url} target="_blank" className="text-sm text-sky-600">
                Ver PDF
              </a>
            )}
          </div>

          <div>
            <Label>Información sobre Vitrectomía</Label>
            <Textarea
              value={formData.vitrectomy_info}
              onChange={(e) => setFormData({ ...formData, vitrectomy_info: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label>Texto del Compromiso de Cuidado</Label>
            <Textarea
              value={formData.care_agreement_text}
              onChange={(e) => setFormData({ ...formData, care_agreement_text: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Color Primario</Label>
              <Input
                type="color"
                value={formData.primary_color}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
              />
            </div>
            <div>
              <Label>Color Secundario</Label>
              <Input
                type="color"
                value={formData.secondary_color}
                onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending || uploading}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}