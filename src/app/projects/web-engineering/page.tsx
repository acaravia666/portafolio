import ServicePage from '@/components/projects/ServicePage'

export default function WebEngineeringPage() {
  return (
    <ServicePage
      serviceId="SERVICE_01"
      title="WEB ENGINEERING"
      tagline="Plataformas de alto rendimiento construidas para escalar, convertir y durar."
      stack={['Next.js', 'React', 'TypeScript', 'Supabase', 'Node.js', 'Vercel']}
      duration="4–12 semanas"
      delivery="Código fuente + deploy + documentación técnica"
      steps={[
        {
          title: 'Arquitectura & Planificación',
          description:
            'Definición de stack, estructura de datos, integraciones y roadmap técnico detallado. Entregable: documento de arquitectura aprobado.',
        },
        {
          title: 'Diseño de Sistema',
          description:
            'Componentes reutilizables, design tokens, sistema de rutas y estructura de API. Todo documentado antes de escribir la primera línea de producción.',
        },
        {
          title: 'Desarrollo & Iteración',
          description:
            'Sprints semanales con demos. Frontend, backend y base de datos construidos en paralelo con integración continua desde el día uno.',
        },
        {
          title: 'QA, Performance & Deploy',
          description:
            'Auditoría Lighthouse, optimización Core Web Vitals, configuración de CI/CD y lanzamiento a producción con monitoreo activo.',
        },
      ]}
      useCases={[
        'Startups que necesitan un MVP sólido y escalable sin deuda técnica desde el inicio.',
        'Empresas migrando de plataformas legacy que no pueden permitirse tiempo de inactividad.',
        'Productos SaaS B2B que requieren multi-tenancy, dashboards y APIs robustas.',
        'E-commerce de alto volumen donde cada 100ms de latencia impacta la conversión.',
      ]}
      ctaHeadline="ARQUITECTURA QUE ESCALA CONTIGO"
      deliverableLabels={['FRONTEND_SYSTEM', 'API_ARCHITECTURE', 'DEPLOY_CONFIG']}
    />
  )
}
