import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, FileText, ShieldCheck, Phone, Settings, User } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = React.useState(false);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => base44.entities.Settings.list(),
    initialData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const config = settings[0] || {};

  // Check if user is admin
  React.useEffect(() => {
    base44.auth.isAuthenticated()
      .then(isAuth => {
        if (!isAuth) return null;
        return base44.auth.me();
      })
      .then(userData => {
        if (userData && userData.role === 'admin') {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, []);

  React.useEffect(() => {
    // Protección anti-copia: deshabilitar clic derecho
    const disableRightClick = (e) => {
      e.preventDefault();
      return false;
    };
    
    // Protección anti-copia: deshabilitar selección de texto con teclado
    const disableKeyboardCopy = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
    };
    
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableKeyboardCopy);
    
    // SEO optimization
    document.title = "REVIT - Equipos de Reposo Post-Vitrectomía | Recuperación Ocular";
    
    // Viewport for mobile
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.name = "viewport";
      document.head.appendChild(metaViewport);
    }
    metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes";

    // iOS-specific meta tags
    const metaAppleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]') || document.createElement('meta');
    metaAppleCapable.name = "apple-mobile-web-app-capable";
    metaAppleCapable.content = "yes";
    if (!metaAppleCapable.parentNode) document.head.appendChild(metaAppleCapable);

    const metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') || document.createElement('meta');
    metaAppleStatusBar.name = "apple-mobile-web-app-status-bar-style";
    metaAppleStatusBar.content = "black-translucent";
    if (!metaAppleStatusBar.parentNode) document.head.appendChild(metaAppleStatusBar);

    const metaFormatDetection = document.querySelector('meta[name="format-detection"]') || document.createElement('meta');
    metaFormatDetection.name = "format-detection";
    metaFormatDetection.content = "telephone=yes";
    if (!metaFormatDetection.parentNode) document.head.appendChild(metaFormatDetection);

    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.name = "description";
    metaDescription.content = "REVIT ofrece equipos de reposo para cirugía de retina, vitrectomía, operación de mácula. Recuperación post-operatoria boca abajo 24/7. Renta de equipos para cirugía ocular en México.";
    if (!metaDescription.parentNode) document.head.appendChild(metaDescription);

    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.name = "keywords";
    metaKeywords.content = "vítreo, vitrectomia, vitrectomía, operación de ojos, reposo post-operación, post-operatorio, post-operatoria, mácula, dormir 24/7 boca abajo, boca abajo, REVIT, revit, Revit, operación ocular, retina, Retina, recuperación de ojos, recuperación ocular, recuperación después de cirugía, cirugía ocular, cirugía de ojos, cirugía estética, cirugías, cirugía, cirugía de retina, cirugía de mácula, Mácula, cirugía de 24/7, equipo de reposo, renta de equipos médicos, recuperación vitrectomía, postoperatorio ocular, renta de equipos, renta 24/7, renta de equipos para recuperación, recuperación de vista, vista, cirugía de vista, renta de equipos post-cirugía, renta de equipos post, renta de equipo para después de operación de retina, Oftalmólogo, oftalmología, oftalmo, tratamiento, tratamiento post, tratamiento oftalmico, postoperatorio, post-operatoria, procedimientos, procedimiento";
    if (!metaKeywords.parentNode) document.head.appendChild(metaKeywords);

    const metaRobots = document.querySelector('meta[name="robots"]') || document.createElement('meta');
    metaRobots.name = "robots";
    metaRobots.content = "index, follow";
    if (!metaRobots.parentNode) document.head.appendChild(metaRobots);

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute("property", "og:title");
    ogTitle.content = "REVIT - Equipos de Reposo Post-Vitrectomía";
    if (!ogTitle.parentNode) document.head.appendChild(ogTitle);

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute("property", "og:description");
    ogDescription.content = "Renta de equipos especializados para recuperación post-operatoria de cirugía de retina, vitrectomía y mácula. Reposo boca abajo 24/7.";
    if (!ogDescription.parentNode) document.head.appendChild(ogDescription);

    const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
    ogUrl.setAttribute("property", "og:url");
    ogUrl.content = "https://www.vitrectomia.com";
    if (!ogUrl.parentNode) document.head.appendChild(ogUrl);

    const ogType = document.querySelector('meta[property="og:type"]') || document.createElement('meta');
    ogType.setAttribute("property", "og:type");
    ogType.content = "website";
    if (!ogType.parentNode) document.head.appendChild(ogType);

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.rel = "canonical";
    canonical.href = "https://www.vitrectomia.com";
    if (!canonical.parentNode) document.head.appendChild(canonical);
    
    // Meta copyright
    const metaCopyright = document.querySelector('meta[name="copyright"]') || document.createElement('meta');
    metaCopyright.name = "copyright";
    metaCopyright.content = `© ${new Date().getFullYear()} REVIT - Todos los derechos reservados. Contenido protegido.`;
    if (!metaCopyright.parentNode) document.head.appendChild(metaCopyright);
    
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableKeyboardCopy);
    };
  }, []);

  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  const navItems = [
    { name: "Inicio", page: "Home", icon: Home },
    { name: "Información", page: "About", icon: FileText },
    { name: "Rentar", page: "Rental", icon: ShieldCheck },
  ];

  const primaryColor = config.primary_color || "#0ea5e9";
  const secondaryColor = config.secondary_color || "#3b82f6";
  const fontFamily = config.font_family || "system-ui";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 relative" style={{ fontFamily }}>
        {/* Logo REVIT fijo en el fondo con efecto de piedra */}
        <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 0 }}
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6901c9d1bd4be7f42a2bce19/e53f5f2b8_InShot_20260115_143226539.jpg" 
            alt=""
            className="w-[60%] md:w-[50%] lg:w-[45%] h-auto object-contain"
            style={{
              opacity: 0.35,
              filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 6px rgba(0, 0, 0, 0.7)) drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.8)) drop-shadow(-3px -3px 4px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.5)) contrast(1.4) brightness(1.15)',
            }}
          />
        </div>
        <style>
        {`
          :root {
            --primary-color: ${primaryColor};
            --secondary-color: ${secondaryColor};
          }
          * {
            font-family: ${fontFamily};
            -webkit-tap-highlight-color: transparent;
          }
          html {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          body {
            overflow-x: hidden;
          }
          img, .select-none {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }
          p, h1, h2, h3, h4, h5, h6, span, div:not(button):not(a) {
            user-select: none;
            -webkit-user-select: none;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1), 
                         -1px -1px 2px rgba(255, 255, 255, 0.5),
                         2px 2px 4px rgba(0, 0, 0, 0.05);
          }
          input, textarea, button, a {
            user-select: text !important;
            -webkit-user-select: text !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          button, a {
            touch-action: manipulation;
            cursor: pointer;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        `}
      </style>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-sky-200 sticky top-0 shadow-sm" style={{ zIndex: 100 }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo REVIT y Título */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6901c9d1bd4be7f42a2bce19/e53f5f2b8_InShot_20260115_143226539.jpg" 
                alt="REVIT Logo"
                className="h-16 w-auto object-contain"
                style={{
                  filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 6px rgba(0, 0, 0, 0.7)) drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.8)) drop-shadow(-3px -3px 4px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.6)) contrast(1.5) brightness(1.2)',
                }}
              />
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gray-900">{config.company_name || "Renta de Equipos Post-Operatorios"}</h1>
                <p className="text-sm text-sky-600">Post-Vitrectomía</p>
              </div>
            </Link>

            {/* Contact & Admin Access */}
            <div className="hidden lg:flex items-center gap-4">
              {config.phone_1 && (
                <a
                  href={`https://wa.me/${config.phone_1.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 flex items-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              {isAdmin && (
                <Link
                  to={createPageUrl("Admin")}
                  className="px-5 py-2.5 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 flex items-center gap-2 shadow-md"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
            </div>


        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative" style={{ zIndex: 10 }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-sky-900 to-blue-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <p className="text-sky-200 text-sm mb-3">Atención exclusiva por WhatsApp</p>
              <a href="https://wa.me/528141955443" target="_blank" rel="noopener noreferrer" className="mb-2 flex items-center gap-2 hover:text-sky-300 transition-colors">
                <Phone className="w-4 h-4" />
                8141955443
              </a>
              <a href="https://wa.me/528134474140" target="_blank" rel="noopener noreferrer" className="mb-2 flex items-center gap-2 hover:text-sky-300 transition-colors">
                <Phone className="w-4 h-4" />
                8134474140
              </a>
              <a href="https://wa.me/528128727402" target="_blank" rel="noopener noreferrer" className="mb-2 flex items-center gap-2 hover:text-sky-300 transition-colors">
                <Phone className="w-4 h-4" />
                8128727402
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Nuestros Servicios</h3>
              <ul className="space-y-2 text-sky-100">
                <li>• Renta de equipos de reposo</li>
                <li>• Envío a toda la república</li>
                <li>• Asesoría personalizada</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Horario</h3>
              <p className="text-sky-100">Lunes a Viernes: 9:00 AM - 7:00 PM</p>
              <p className="text-sky-100">Sábado: 9:00 AM - 2:00 PM</p>
              <p className="text-sky-100 mt-4">Respuesta inmediata por WhatsApp</p>
            </div>
          </div>
          <div className="border-t border-sky-700 mt-8 pt-8 text-center">
            <p className="text-sky-200 text-sm">
              © {new Date().getFullYear()} {config.company_name || "REVIT - Equipos de Reposo"}. Todos los derechos reservados.
            </p>
            <p className="text-sky-400 text-xs mt-2">
              www.vitrectomia.com | Monterrey, Nuevo León, México
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}