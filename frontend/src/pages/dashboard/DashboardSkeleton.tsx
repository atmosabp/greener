import { Skeleton } from "../../components/skeleton/Skeleton";

// Larguras variadas para parecer dados reais
const NAME_WIDTHS = ["62%", "48%", "70%", "55%", "40%", "66%", "52%", "58%"];

/*
 * Lista "Outros serviços"
*/
export function ServiceListSkeleton({ rows }: { rows: number }) {
  return (
    <ul aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i}>
          <div className="service-link-url">
            <button
              type="button"
              className="service-link"
              tabIndex={-1}
              style={{ pointerEvents: "none" }}
            >
              <Skeleton width={10} height={10} circle />
              <Skeleton
                width={NAME_WIDTHS[i % NAME_WIDTHS.length]}
                height="0.9rem"
              />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

/*
 * Esqueleto do .dashboard-grid inteiro
*/
export function DashboardGridSkeleton() {
  return (
    <div className="dashboard-grid" aria-busy="true" aria-label="Carregando métricas do serviço">
      <section className="service-info service-info--selected">
        <h4>Serviço selecionado</h4>
        <Skeleton width="70%" height="1rem" />
      </section>

      <section className="service-info service-info--status">
        <h4>Status</h4>
        <div className="service-info-status">
          <Skeleton width={10} height={10} circle />
          <Skeleton width={56} height="1rem" />
        </div>
      </section>

      <section className="service-info service-info--location">
        <h4>Localização</h4>
        <Skeleton width="85%" height="1rem" />
      </section>

      <section className="metric-card metric-card--data metric-energy">
        <p>Consumo energético</p>
        <Skeleton width="60%" height="2rem" />
      </section>

      <section className="metric-card metric-card--data metric-co2">
        <p>Emissão de CO₂e</p>
        <Skeleton width="60%" height="2rem" />
      </section>

      <div className="metrics-carousel">
        <div className="metrics-header">
          <h3>Métricas</h3>
        </div>
        <div className="metrics-track">
          {[
            ["CPU", "metric-cpu", "1/4"],
            ["Memória", "metric-memory", "2/4"],
            ["Armazenamento", "metric-storage", "3/4"],
            ["Rede", "metric-network", "4/4"],
          ].map(([label, cls, counter]) => (
            <section key={cls} className={`metric-card metric-card--usage ${cls}`}>
              <p>{label}</p>
              <span className="metric-counter">{counter}</span>
              <Skeleton width="55%" height="2rem" />
            </section>
          ))}
        </div>
      </div>

      <div className="analytics">
        <section className="analytics-card analytics-card--renewable">
          <h3>Energia renovável</h3>
          <Skeleton circle width={140} height={140} style={{ margin: "0 auto" }} />
        </section>

        <section className="analytics-card analytics-card--carbon">
          <h3>Intensidade de carbono</h3>
          <Skeleton width={70} height="1.1rem" />
          <Skeleton width="100%" height={10} radius={999} style={{ margin: "14px 0" }} />
          <Skeleton width="45%" height="0.9rem" />
        </section>
      </div>

      <aside className="other-services" aria-labelledby="others-title-skeleton">
        <h3 id="others-title-skeleton">Outros serviços</h3>
        <ServiceListSkeleton rows={8} />
      </aside>
    </div>
  );
}