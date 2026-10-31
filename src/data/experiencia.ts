export interface Experiencia {
  anio: string;
  rol: string;
  empresa: string;
  periodo: string;
  tareas: string[];
  tags: string[];
}

export const experiencia: Experiencia[] = [
  {
    anio: '2026',
    rol: 'QA Engineer',
    empresa: 'CDA Informática',
    periodo: 'jun. 2026 – actualidad',
    tareas: [
      'Diseño y ejecuto pruebas sobre procesos batch y reportes críticos en mainframe, con evidencia trazable de punta a punta.',
      'Analizo requerimientos y defino criterios de aceptación verificables.',
      'Diseño casos positivos, negativos y de regresión, con trazabilidad contra cada requerimiento.',
      'Preparo datos y ambientes de prueba, y valido los datos con consultas SQL sobre DB2.',
      'Ejecuto procesos batch y analizo sus resultados, logs y archivos generados.',
      'Gestiono planes de prueba, evidencia y defectos en Jira/Xray, en un equipo Scrum con desarrollo, negocio y operaciones.',
    ],
    tags: ['z/OS', 'COBOL', 'JCL', 'DB2', 'SQL', 'Control-M', 'Jira/Xray'],
  },
  {
    anio: '2024',
    rol: 'QA Analyst',
    empresa: 'Banco Galicia',
    periodo: 'ene. 2024 – jun. 2026',
    tareas: [
      'Hice testing E2E de sistemas core de pagos en arquitecturas distribuidas con microservicios.',
      'En la integración de HSBC con Galicia me ocupé de las pruebas no funcionales: performance, armado de datos de prueba y backend.',
      'Validé APIs REST con Postman y SoapUI: contratos, payloads e integraciones entre servicios.',
      'Hice pruebas de performance con JMeter: carga, tiempos de respuesta y estabilidad en flujos críticos.',
      'Virtualicé servicios con Parasoft Virtualize para probar de forma desacoplada y simular entornos.',
      'Usé SQL sobre SQL Server para validar datos y preparar escenarios en mainframe.',
      'Analicé logs e hice debugging para diagnosticar incidentes en sistemas complejos.',
      'Participé en code scanning para detectar vulnerabilidades potenciales.',
      'Colaboré con arquitectura, desarrollo y negocio en equipos Scrum.',
    ],
    tags: ['Postman', 'SoapUI', 'JMeter', 'Parasoft Virtualize', 'SQL Server'],
  },
  {
    anio: '2022',
    rol: 'QA Analyst',
    empresa: 'Banco Galicia',
    periodo: 'sept. 2022 – dic. 2023',
    tareas: [
      'Hice testing funcional E2E del CRM interno del banco, desde la interacción del agente hasta el impacto en backend.',
      'Diseñé y ejecuté casos de prueba para operaciones críticas de negocio, e hice UAT con referentes funcionales.',
      'Validé integraciones frontend ↔ servicios ↔ SQL Server.',
      'Hice pruebas exploratorias en web sobre flujos de agente y cliente.',
      'Reporté y seguí defectos en HP ALM, priorizados por impacto en UX y negocio.',
      'Trabajé en equipo ágil (Scrum) con desarrollo, producto y operaciones.',
    ],
    tags: ['HP ALM', 'SQL Server', 'Scrum'],
  },
];
