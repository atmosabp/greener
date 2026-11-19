import { Skeleton } from "../../components/skeleton/Skeleton";

const NAME_WIDTHS = ["58%", "72%", "46%", "64%", "52%", "68%"];

/** Para colocar um Skeleton no meio de um texto/linha (o padrão dele é display:block). */
export const inlineSkeleton = { display: "inline-block", verticalAlign: "middle" } as const;

/*
-> Itens da lista "Seus serviços".
-> Reaproveita as classes .service-item / .service-index / .service-content da tela real, então o espaçamento e a altura já batem. "pointerEvents: none" evita hover/clique.
 */

export function ServicesListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="service-item"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          <span className="service-index">
            <Skeleton width={18} height="0.9rem" style={inlineSkeleton} />
          </span>
          <Skeleton width={10} height={10} circle />
          <span className="service-content">
            <Skeleton width={NAME_WIDTHS[i % NAME_WIDTHS.length]} height="0.95rem" />
            <Skeleton width={56} height="0.7rem" style={{ marginTop: 6 }} />
          </span>
        </div>
      ))}
    </>
  );
}

/** Área do globo/mapa. No modo globo vira um círculo; no mapa, um retângulo. */
export function StageSkeleton({ mode }: { mode: "globe" | "map" }) {
  if (mode === "globe") {
    return (
      <Skeleton
        circle
        width="min(100%, 420px)"
        height="auto"
        style={{ aspectRatio: "1 / 1", margin: "auto" }}
      />
    );
  }
  return <Skeleton width="100%" height="100%" radius={16} style={{ minHeight: 320 }} />;
}