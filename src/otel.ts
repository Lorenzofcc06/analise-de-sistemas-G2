import { initializeFaro, getWebInstrumentations } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

export function initOpenTelemetry() {
  if (typeof window === 'undefined') return;

  try {
    initializeFaro({
      // URL Oficial de Frontend do Grafana (sem problemas de CORS!)
      url: 'https://faro-collector-prod-sa-east-1.grafana.net/collect/7b31217a9647d624c9eb5efa57dc9470',
      app: {
        name: 'Analise de Sistemas G2',
        version: '1.0.0',
        environment: import.meta.env.DEV ? 'development' : 'production'
      },
      instrumentations: [
        // Captura Erros de Console, Web Vitals e Sessões de Usuários
        ...getWebInstrumentations(),
        
        // Ativa o rastreamento OpenTelemetry debaixo dos panos para chamadas de API (fetch)
        new TracingInstrumentation(),
      ],
    });

    console.log('[Grafana Faro] Instrumentação RUM e Tracing ativada com sucesso!');
  } catch (error) {
    console.error('[Grafana Faro] Falha ao inicializar:', error);
  }
}
