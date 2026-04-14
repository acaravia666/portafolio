import ServicePage from '@/components/projects/ServicePage'

export default function UXUIDesignPage() {
  return (
    <ServicePage
      serviceId="SERVICE_02"
      title="UX/UI SYSTEM DESIGN"
      tagline="Interfaces que retienen usuarios. Diseño industrial con precisión funcional."
      stack={['Figma', 'FigJam', 'Design Tokens', 'Framer', 'Lottie']}
      duration="2–6 semanas"
      delivery="Sistema de diseño + handoff de componentes + prototipo navegable"
      steps={[
        {
          title: 'Research & Discovery',
          description:
            'Entrevistas de usuario, análisis competitivo, mapas de journey y definición de métricas de retención. Entendemos el problema antes de diseñar.',
        },
        {
          title: 'Arquitectura de Información',
          description:
            'Sitemap, flujos de usuario y wireframes de baja fidelidad validados con stakeholders. Estructura sólida antes de aplicar estilo.',
        },
        {
          title: 'Sistema Visual',
          description:
            'Design tokens, biblioteca de componentes Figma, grid system y guía tipográfica. Un sistema que escala sin inconsistencias.',
        },
        {
          title: 'Prototipo & Handoff',
          description:
            'Prototipo interactivo navegable, specs de desarrollo con anotaciones de comportamiento y guía de estados. Listo para implementar sin preguntas.',
        },
      ]}
      useCases={[
        'Productos digitales con problemas de retención o altas tasas de abandono en onboarding.',
        'Rediseños de plataforma SaaS que necesitan coherencia visual sin romper flujos existentes.',
        'Apps móviles pre-desarrollo que necesitan validar flujos con usuarios antes de codificar.',
        'Startups pre-seed que necesitan un producto visualmente sólido para su pitch deck.',
      ]}
      ctaHeadline="DISEÑO QUE CONVIERTE Y RETIENE"
      deliverableLabels={['WIREFRAMES_SYSTEM', 'COMPONENT_LIBRARY', 'PROTOTYPE_FLOW']}
    />
  )
}
