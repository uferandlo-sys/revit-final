import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Trash2 } from "lucide-react";

export default function TestimonialManager() {
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list('-created_date'),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Testimonial.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Testimonial.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const toggleApproval = (testimonial) => {
    updateMutation.mutate({
      id: testimonial.id,
      data: { ...testimonial, approved: !testimonial.approved }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Comentarios</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Cargando...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-gray-500">No hay comentarios</p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className={`border-2 ${testimonial.approved ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold">{testimonial.client_name}</h3>
                      {testimonial.equipment_name && (
                        <p className="text-sm text-gray-600">{testimonial.equipment_name}</p>
                      )}
                    </div>
                    <Badge className={testimonial.approved ? 'bg-green-500' : 'bg-yellow-500'}>
                      {testimonial.approved ? 'Aprobado' : 'Pendiente'}
                    </Badge>
                  </div>

                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{testimonial.comment}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={testimonial.approved ? 'outline' : 'default'}
                      onClick={() => toggleApproval(testimonial)}
                      className={testimonial.approved ? '' : 'bg-green-600 hover:bg-green-700'}
                    >
                      {testimonial.approved ? (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Desaprobar
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Aprobar
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('¿Eliminar este comentario?')) {
                          deleteMutation.mutate(testimonial.id);
                        }
                      }}
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
  );
}