import ServicePage from '@/components/projects/ServicePage'

export default function AutoOpsCRMPage() {
  return (
    <ServicePage
      serviceId="SERVICE_04"
      title="AUTO-OPS & CRM"
      tagline="Operaciones que se ejecutan solas. Automatización end-to-end con GoHighLevel y AI."
      stack={['GoHighLevel', 'Make.com', 'Zapier', 'Claude API', 'WhatsApp API']}
      duration="2–4 semanas"
      delivery="Sistema activo + documentación de flujos + capacitación del equipo"
      steps={[
        {
          title: 'Diagnóstico Operativo',
          description:
            'Mapeo de procesos actuales, identificación de fricciones críticas y definición de KPIs a mejorar. No automatizamos el caos — primero lo ordenamos.',
        },
        {
          title: 'Arquitectura de Automatización',
          description:
            'Diseño de flujos, selección de herramientas según el stack existente y configuración del CRM como centro de comando de toda la operación.',
        },
        {
          title: 'Implementación & Conexión',
          description:
            'Construcción de workflows, integraciones de canales (email, WhatsApp, Meta, Instagram) y configuración de triggers inteligentes con lógica condicional.',
        },
        {
          title: 'Activación & Capacitación',
          description:
            'Pruebas en vivo con leads reales, ajuste fino de secuencias y entrenamiento del equipo en el nuevo sistema. Documentación completa incluida.',
        },
      ]}
      useCases={[
        'Agencias con alto volumen de leads que pierden oportunidades por respuesta tardía.',
        'Consultoras donde el equipo gasta más tiempo en admin que en entregar valor al cliente.',
        'Negocios con procesos repetitivos (seguimiento, agendamiento, cotizaciones) que consumen tiempo del equipo.',
        'Empresas que quieren integrar AI en su operación sin contratar un equipo técnico interno.',
      ]}
      ctaHeadline="OPERA MÁS, ADMINISTRA MENOS"
      deliverableLabels={['CRM_PIPELINE', 'AUTOMATION_FLOWS', 'INTEGRATION_MAP']}
    />
  )
}
