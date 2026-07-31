import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";

import EquipmentManager from "@/components/admin/EquipmentManager";
import RentalManager from "@/components/admin/RentalManager";
import TestimonialManager from "@/components/admin/TestimonialManager";
import ClientManager from "@/components/admin/ClientManager";
import SettingsManager from "@/components/admin/SettingsManager";
import DoctorManager from "@/components/admin/DoctorManager";
import PackageManager from "@/components/admin/PackageManager";
import TeamMemberManager from "@/components/admin/TeamMemberManager";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let mounted = true;
    
    base44.auth.isAuthenticated()
      .then(isAuth => {
        if (!mounted) return;
        if (!isAuth) {
          window.location.href = "/";
          return;
        }
        return base44.auth.me();
      })
      .then(userData => {
        if (!mounted) return;
        if (userData && userData.role === 'admin') {
          setUser(userData);
        } else {
          window.location.href = "/";
        }
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        window.location.href = "/";
      });

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900">
            Panel de Administración
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Gestiona equipos, rentas, comentarios y configuración
        </p>
      </div>

      <Tabs defaultValue="equipment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white border-2 border-sky-200 p-1 rounded-xl">
          <TabsTrigger value="equipment" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            Equipos
          </TabsTrigger>
          <TabsTrigger value="packages" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            Paquetes
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            Equipo
          </TabsTrigger>
          <TabsTrigger value="rentals" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            Rentas
          </TabsTrigger>
          <TabsTrigger value="clients" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            Clientes
          </TabsTrigger>
          <TabsTrigger value="doctors" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            Doctores
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            Comentarios
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg">
            Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment">
          <EquipmentManager />
        </TabsContent>

        <TabsContent value="packages">
          <PackageManager />
        </TabsContent>

        <TabsContent value="team">
          <TeamMemberManager />
        </TabsContent>

        <TabsContent value="rentals">
          <RentalManager />
        </TabsContent>

        <TabsContent value="clients">
          <ClientManager />
        </TabsContent>

        <TabsContent value="doctors">
          <DoctorManager />
        </TabsContent>

        <TabsContent value="testimonials">
          <TestimonialManager />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}