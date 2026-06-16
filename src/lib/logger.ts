/**
 * Utilitário de Logger Estruturado.
 * Em produção, os logs estruturados são automaticamente processados pelo Grafana Cloud ou Datadog.
 */
export const logger = {
  info: (message: string, data?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'INFO', timestamp: new Date().toISOString(), message, ...data }));
  },
  warn: (message: string, data?: Record<string, any>) => {
    console.warn(JSON.stringify({ level: 'WARN', timestamp: new Date().toISOString(), message, ...data }));
  },
  error: (message: string, error?: unknown, data?: Record<string, any>) => {
    console.error(JSON.stringify({ 
      level: 'ERROR', 
      timestamp: new Date().toISOString(), 
      message, 
      error: error instanceof Error ? error.message : String(error),
      ...data 
    }));
  }
};
