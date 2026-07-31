import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function EquipmentManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    usage_images: [],
    available: true,
    features: []
  });
  const [newFeature, setNewFeature] = useState("");
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Equipment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Equipment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Equipment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      image_url: "",
      usage_images: [],
      available: true,
      features: []
    });
    setEditingEquipment(null);
    setShowForm(false);
    setNewFeature("");
  };

  const handleEdit = (eq) => {
    setEditingEquipment(eq);
    setFormData({
      name: eq.name || "",
      description: eq.description || "",
      price: eq.price || 0,
      image_url: eq.image_url || "",
      usage_images: eq.usage_images || [],
      available: eq.available !== undefined ? eq.available : true,
      features: eq.features || []
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEquipment) {
      updateMutation.mutate({ id: editingEquipment.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUpload = async (e, type = "main") => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      if (type === "main") {
        setFormData({ ...formData, image_url: result.file_url });
      } else {
        setFormData({ 
          ...formData, 
          usage_images: [...(formData.usage_images || []), result.file_url] 
        });
      }
    } catch (error) {
      alert("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ 
        ...formData, 
        features: [...(formData.features || []), newFeature.trim()] 
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData({ 
      ...formData, 
      features: formData.features.filter((_, i) => i !== index) 
    });
  };

  const removeUsageImage = (index) => {
    setFormData({ 
      ...formData, 
      usage_images: formData.usage_images.filter((_, i) => i !== index) 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Equipos</CardTitle>
          <Button onClick={() => setShowForm(true)} className="bg-sky-500 hover:bg-sky-600">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Equipo
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando...</p>
          ) : equipment.length === 0 ? (
            <p className="text-gray-500">No hay equipos registrados</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map((eq) => (
                <Card key={eq.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{eq.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{eq.description}</p>
                    <p className="text-xl font-bold text-sky-600 mb-2">${eq.price}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">Disponible:</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${eq.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {eq.available ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(eq)} size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => {
                          if (confirm('¿Eliminar este equipo?')) {
                            deleteMutation.mutate(eq.id);
                          }
                        }}
                        size="sm" 
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEquipment ? 'Editar' : 'Nuevo'} Equipo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label>Precio *</Label>
              <Input
                required
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label>Imagen Principal</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "main")}
                  disabled={uploading}
                />
                {uploading && <span className="text-sm">Subiendo...</span>}
              </div>
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="mt-2 h-32 rounded" />
              )}
            </div>

            <div>
              <Label>Imágenes de Uso</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "usage")}
                disabled={uploading}
              />
              {formData.usage_images?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.usage_images.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img src={url} alt={`Uso ${idx}`} className="h-20 rounded" />
                      <button
                        type="button"
                        onClick={() => removeUsageImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Características</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Nueva característica"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.features?.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {formData.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label>Disponible para renta</Label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingEquipment ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}