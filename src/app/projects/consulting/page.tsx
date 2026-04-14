import ServicePage from '@/components/projects/ServicePage'

export default function ConsultingPage() {
  return (
    <ServicePage
      serviceId="SERVICE_05"
      title="CONSULTORÍA & CAPACITACIÓN"
      tagline="Estrategia, mentoría y formación para equipos que quieren operar con AI desde adentro."
      stack={['Notion', 'Loom', 'Zoom', 'Claude API', 'Make.com', 'GoHighLevel']}
      duration="1–8 semanas"
      delivery="Plan de implementación + sesiones grabadas + recursos del equipo"
      steps={[
        {
          title: 'Diagnóstico Inicial',
          description:
            'Evaluación del nivel de madurez digital del equipo, identificación de brechas de conocimiento y definición de objetivos medibles para la capacitación.',
        },
        {
          title: 'Diseño del Programa',
          description:
            'Plan de sesiones personalizado según el rol de cada integrante del equipo. Contenido práctico, sin teoría innecesaria, orientado a resultados reales.',
        },
        {
          title: 'Sesiones & Talleres',
          description:
            'Workshops en vivo (individuales o grupales) con ejercicios prácticos aplicados directamente al contexto del negocio. Grabaciones disponibles para revisión posterior.',
        },
        {
          title: 'Seguimiento & Recursos',
          description:
            'Documentación de los flujos implementados, recursos de referencia y sesión de seguimiento 30 días después para validar adopción y resolver dudas.',
        },
      ]}
      useCases={[
        'Equipos que adoptaron herramientas de AI pero no las usan a su máximo potencial.',
        'Fundadores que quieren entender qué automatizar antes de contratar a alguien que lo haga.',
        'Agencias que quieren ofrecer servicios de AI a sus clientes y necesitan formación interna.',
        'Empresas que implementaron GoHighLevel o Make.com y necesitan dominar la plataforma.',
      ]}
      ctaHeadline="TU EQUIPO, POTENCIADO CON AI"
      deliverableLabels={['SESSION_RECORDINGS', 'IMPLEMENTATION_PLAN', 'RESOURCE_KIT']}
    />
  )
}
