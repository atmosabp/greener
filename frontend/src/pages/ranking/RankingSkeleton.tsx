import { Skeleton } from "../../components/skeleton/Skeleton";

const NAME_WIDTHS = ["58%", "72%", "46%", "64%", "52%", "68%"];

/** Para colocar um Skeleton no meio de um texto/linha (o padrão dele é display:block). */
export const inlineSkeleton = { display: "inline-block", verticalAlign: "middle" } as const;    

export function RankingTableSkeletonRows({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i}>
          <td>
            <div className="cell-id">
              <Skeleton width={50} height={24} />{/* posição */}
            </div>
          </td>
          <td>
            <Skeleton width={NAME_WIDTHS[i % NAME_WIDTHS.length]} height={24} /> {/*Serviço*/   }
          </td>
          <td>
            <Skeleton width="60%" height={24} />   {/* Consumo Energético */}
          </td>
          <td>
            <Skeleton width="60%" height={24} />   {/* Emissão de CO₂e */}
          </td>
        </tr>
      ))}
    </>
  );
}