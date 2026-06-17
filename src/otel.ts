import { initializeFaro, getWebInstrumentations, UserActionInstrumentation } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

// Variável global para evitar que o React Fast Refresh tente iniciar o Faro duas vezes
let isFaroInitialized = false;

export function initOpenTelemetry() {
  if (typeof window === 'undefined' || isFaroInitialized) return;

  try {
    initializeFaro({
      // Usamos a URL fixa como fallback caso a variável de ambiente não carregue a tempo
      url: import.meta.env.VITE_OTLP_ENDPOINT || 'https://faro-collector-prod-sa-east-1.grafana.net/collect/7b31217a9647d624c9eb5efa57dc9470',
      app: {
        name: 'Analise de Sistemas G2',
        version: '1.0.0',
        environment: 'development',
      },
      instrumentations: [
        // Captura Erros de Console, Web Vitals e Sessões de Usuários
        ...getWebInstrumentations(),
        // Ativa o Rastreamento Completo (Traces)
        new TracingInstrumentation(),
        // Ativa o Rastreamento Automático de Cliques para o Dashboard "User Actions"
        new UserActionInstrumentation(),
      ],
    });

    isFaroInitialized = true;
    console.log('[Grafana Faro] Instrumentação RUM e Tracing ativada com sucesso!');
  } catch (err) {
    console.error('Falha ao inicializar instrumentação OTel/Faro:', err);
  }
}
