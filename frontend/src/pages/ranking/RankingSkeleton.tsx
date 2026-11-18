import { Skeleton } from "../../components/skeleton/Skeleton";

const NAME_WIDTHS = ["58%", "72%", "46%", "64%", "52%", "68%"];

/** Para colocar um Skeleton no meio de um texto/linha (o padrão dele é display:block). */
export const inlineSkeleton = {
  display: "inline-block",
  verticalAlign: "middle",
} as const;

export function RankingTableSkeletonRows({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i}>
          <td>
            <div
              className="cell-id"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Skeleton width={50} height={24} /> {/* posição */}
            </div>
          </td>
          <td>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Skeleton
                width={NAME_WIDTHS[i % NAME_WIDTHS.length]}
                height={24}
              />
              {/* Serviço */}
            </div>
          </td>
          <td>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Skeleton width="60%" height={24} /> {/* Consumo Energético */}
            </div>
          </td>
          <td>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Skeleton width="60%" height={24} /> {/* Emissão de CO₂e */}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
