export interface Experiencia {
  anio: string;
  rol: string;
  empresa: string;
  periodo: string;
  descripcion: string;
  tags: string[];
}

export const experiencia: Experiencia[] = [
  {
    anio: '2026',
    rol: 'QA Analyst',
    empresa: 'CDA Informática',
    periodo: 'jun. 2026 – actualidad',
    descripcion:
      'QA funcional y técnico sobre mainframe: pruebas de procesos batch y reportes críticos, validación de datos en DB2 y trazabilidad de punta a punta contra cada requerimiento.',
    tags: ['z/OS', 'COBOL', 'JCL', 'DB2', 'Control-M', 'Jira/Xray'],
  },
  {
    anio: '2024',
    rol: 'QA Engineer',
    empresa: 'Banco Galicia',
    periodo: 'ene. 2024 – jun. 2026',
    descripcion:
      'Testing E2E de sistemas core de pagos sobre microservicios: validación de APIs y contratos, pruebas de performance y virtualización de servicios para entornos desacoplados.',
    tags: ['Postman', 'SoapUI', 'JMeter', 'Parasoft Virtualize', 'SQL Server'],
  },
  {
    anio: '2022',
    rol: 'QA Analyst',
    empresa: 'Banco Galicia',
    periodo: 'sept. 2022 – dic. 2023',
    descripcion:
      'Testing funcional E2E del CRM interno, desde la interacción del agente hasta el impacto en backend. UAT con referentes de negocio y gestión de defectos priorizados por impacto.',
    tags: ['HP ALM', 'SQL Server', 'Scrum'],
  },
];
