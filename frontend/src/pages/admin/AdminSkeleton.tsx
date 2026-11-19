import { Skeleton } from "../../components/skeleton/Skeleton";

// Larguras variadas para parecer dados reais
const NAME_WIDTHS = ["62%", "48%", "70%", "55%", "40%"];
const EMAIL_WIDTHS = ["72%", "58%", "80%", "64%", "50%"];

export function AdminTableSkeletonRows({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i}>
          <td>
            <div className="cell-id">
              <Skeleton width={24} height={24} radius={7} /> {/* checkbox */}
              <Skeleton width={28} height="0.9rem" />        {/* id */}
            </div>
          </td>
          <td>
            <Skeleton width={NAME_WIDTHS[i % NAME_WIDTHS.length]} height="0.9rem" />
          </td>
          <td>
            <Skeleton width={EMAIL_WIDTHS[i % EMAIL_WIDTHS.length]} height="0.9rem" />
          </td>
          <td>
            <Skeleton width={36} height={34} radius={9} />   {/* editar */}
          </td>
          <td>
            <Skeleton width={36} height={34} radius={9} />   {/* excluir */}
          </td>
        </tr>
      ))}
    </>
  );
}

export function AdminMobileSkeleton({ rows }: { rows: number }) {
  return (
    <ul className="m-list">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="m-item">
          <div className="m-head">
            <Skeleton width={46} height={46} circle />       {/* botão de expandir */}
            <div className="m-label" style={{ cursor: "default" }}>
              <Skeleton width={36} height="0.9rem" />        {/* "Nome" */}
              <Skeleton width={NAME_WIDTHS[i % NAME_WIDTHS.length]} height="0.9rem" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}