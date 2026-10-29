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
      'Pruebo procesos batch y reportes críticos sobre mainframe. Valido los resultados contra DB2 y dejo evidencia trazable de cada requerimiento en Jira/Xray.',
    tags: ['z/OS', 'COBOL', 'JCL', 'DB2', 'Control-M', 'Jira/Xray'],
  },
  {
    anio: '2024',
    rol: 'QA Engineer',
    empresa: 'Banco Galicia',
    periodo: 'ene. 2024 – jun. 2026',
    descripcion:
      'Probé el core de pagos, armado sobre microservicios. En la integración de HSBC con Galicia me ocupé de las pruebas no funcionales: performance con JMeter, armado de datos de prueba y validación de backend. Virtualicé servicios con Parasoft para probar sin esperar a otros equipos.',
    tags: ['Postman', 'SoapUI', 'JMeter', 'Parasoft Virtualize', 'SQL Server'],
  },
  {
    anio: '2022',
    rol: 'QA Analyst',
    empresa: 'Banco Galicia',
    periodo: 'sept. 2022 – dic. 2023',
    descripcion:
      'Probé de punta a punta el CRM interno, desde la pantalla del agente hasta SQL Server. Hice UAT junto a referentes de negocio y prioricé defectos según su impacto.',
    tags: ['HP ALM', 'SQL Server', 'Scrum'],
  },
];
