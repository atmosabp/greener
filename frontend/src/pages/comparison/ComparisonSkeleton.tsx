import { Skeleton } from "../../components/skeleton/Skeleton";

// Larguras variadas para parecer dados reais
const NAME_WIDTHS = ["62%", "48%", "70%", "55%", "40%", "66%", "52%", "58%"];

/*
 * Lista "Outros serviços"
 */

interface ComparisonServicesSkeletonProps {
  quantity: number;
}

export function ComparisonServicesSkeleton({
  quantity,
}: ComparisonServicesSkeletonProps) {
  return (
    <>
      {Array.from({ length: quantity }, (_, index) => (
        <article key={index} className="cmp-service">
          <h3 className="cmp-service__name">
            <Skeleton width={"100%"} height="1.5rem" />
          </h3>

          <div className="cmp-service__actions">
            <Skeleton width={160} height="2rem" />
          </div>

          <div className="cmp-service__body">
            <div className="cmp-tile skeleton"></div>
            <div className="cmp-tile skeleton"></div>
            <div className="cmp-tiles">
              <div className="cmp-tile skeleton"></div>
              <div className="cmp-tile skeleton"></div>
              <div className="cmp-tile skeleton"></div>
              <div className="cmp-tile skeleton"></div>
            </div>
            <div className="cmp-carbon skeleton"></div>
          </div>
        </article>
      ))}
    </>
  );
}

/*
 * Esqueleto do .cmp-averages
 */

export function CmpAveragesSkeleton() {
  return (
    <section className="cmp-averages" aria-labelledby="avg-title">
      <h2 id="avg-title" className="cmp-averages__title">
        Média indicadores
      </h2>

      <div className="cmp-averages__content">
        <div className="cmp-averages__tiles">
          <div className="cmp-avg-tile">
            <span>Rede</span>
            <Skeleton
              width="30%"
              height="2rem"
              style={{ alignSelf: "flex-end" }}
            />
          </div>

          <div className="cmp-avg-tile">
            <span>CPU</span>
            <Skeleton
              width="30%"
              height="2rem"
              style={{ alignSelf: "flex-end" }}
            />
          </div>

          <div className="cmp-avg-tile">
            <span>Armazenamento</span>

            <Skeleton
              width="30%"
              height="2rem"
              style={{ alignSelf: "flex-end" }}
            />
          </div>

          <div className="cmp-avg-tile">
            <span>Memória</span>
            <Skeleton
              width="30%"
              height="2rem"
              style={{ alignSelf: "flex-end" }}
            />
          </div>
        </div>

        <div className="cmp-gauge-card">
          <h3 className="cmp-gauge-card__title">Consumo energético</h3>

          <svg
            className={`cmp-gauge cmp-gauge--skeleton`}
            viewBox="0 0 160 82"
            role="img"
          >
            <path
              d="M 12 80 A 68 68 0 0 1 148 80"
              pathLength={100}
              className="cmp-gauge__track"
            />
          </svg>
          <div className="cmp-gauge__scale">
            <Skeleton
              width="1rem"
              height="1rem"
              className="cmp-gauge-card__value"
            />
            <Skeleton
              width="2rem"
              height="1rem"
              className="cmp-gauge-card__value"
            />
          </div>

          <Skeleton
            width="50%"
            height="2rem"
            className="cmp-gauge-card__value"
          />
        </div>
        <div className="cmp-gauge-card">
          <h3 className="cmp-gauge-card__title">Emissão de Co₂e</h3>

          <svg
            className={`cmp-gauge cmp-gauge--skeleton`}
            viewBox="0 0 160 82"
            role="img"
          >
            <path
              d="M 12 80 A 68 68 0 0 1 148 80"
              pathLength={100}
              className="cmp-gauge__track"
            />
          </svg>
          <div className="cmp-gauge__scale">
            <Skeleton
              width="1rem"
              height="1rem"
              className="cmp-gauge-card__value"
            />
            <Skeleton
              width="2rem"
              height="1rem"
              className="cmp-gauge-card__value"
            />
          </div>
          <Skeleton
            width="50%"
            height="2rem"
            className="cmp-gauge-card__value"
          />
        </div>
      </div>
    </section>
  );
}
