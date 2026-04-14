import ServicePage from '@/components/projects/ServicePage'

export default function AppArchitecturePage() {
  return (
    <ServicePage
      serviceId="SERVICE_03"
      title="APP ARCHITECTURE"
      tagline="Apps nativas y cross-platform que funcionan en iOS y Android desde un solo codebase."
      stack={['React Native', 'Expo', 'TypeScript', 'Supabase', 'Push Notifications']}
      duration="8–16 semanas"
      delivery="App publicada en App Store + Google Play + código fuente"
      steps={[
        {
          title: 'Arquitectura Técnica',
          description:
            'Definición de navegación, gestión de estado, estructura de módulos y estrategia de sincronización offline. Sin sorpresas en la mitad del desarrollo.',
        },
        {
          title: 'Diseño de Pantallas',
          description:
            'Componentes nativos adaptados a las guías de iOS y Android, sistema de temas claro/oscuro y flujos de onboarding que maximizan la activación.',
        },
        {
          title: 'Desarrollo & Integraciones',
          description:
            'Autenticación, base de datos en tiempo real, push notifications, pagos in-app y conexión a APIs externas. Todo con manejo de estados de error y offline.',
        },
        {
          title: 'Testing & Publicación',
          description:
            'Pruebas en dispositivos físicos iOS y Android, optimización de performance, preparación de assets para stores y submission completo a App Store y Google Play.',
        },
      ]}
      useCases={[
        'Negocios con plataforma web exitosa que necesitan un canal móvil complementario.',
        'MVPs móviles para validar una idea con usuarios reales antes de invertir a gran escala.',
        'Empresas con procesos internos que requieren una app de campo para equipos remotos.',
        'Startups con tracción probada que quieren expandir su distribución al canal móvil.',
      ]}
      ctaHeadline="TU PRODUCTO EN TODOS LOS DISPOSITIVOS"
      deliverableLabels={['IOS_SCREENS', 'ANDROID_SCREENS', 'STORE_ASSETS']}
    />
  )
}
