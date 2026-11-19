import "./Skeleton.css";
import { useEffect, useState, type ReactNode } from "react";

interface SkeletonBoundaryProps {
  /** Estado REAL de carregamento*/
  loading: boolean;
  /** Skeleton específico da página/seção */
  skeleton: ReactNode;
  /** Conteúdo real */
  children: ReactNode;
  /** Só mostra o skeleton se o carregamento passar disso (evita "piscar" em respostas rápidas). */
  delay?: number;
  /** Uma vez mostrado, mantém o skeleton por no mínimo esse tempo (evita flash). */
  minDuration?: number;
  /** Texto lido por leitores de tela */
  label?: string;
}

export function SkeletonBoundary({
  loading,
  skeleton,
  children,
  delay = 150,
  minDuration = 400,
  label = "Carregando conteúdo",
}: SkeletonBoundaryProps) {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [shownAt, setShownAt] = useState<number | null>(null);

  useEffect(() => {
    if (loading) {
      // espera `delay` antes de exibir o skeleton
      const t = setTimeout(() => {
        setShowSkeleton(true);
        setShownAt(Date.now());
      }, delay);
      return () => clearTimeout(t);
    }

    // terminou de carregar -> se o skeleton já apareceu, respeita o tempo mínimo
    if (showSkeleton && shownAt) {
      const remaining = Math.max(0, minDuration - (Date.now() - shownAt));
      const t = setTimeout(() => {
        setShowSkeleton(false);
        setShownAt(null);
      }, remaining);
      return () => clearTimeout(t);
    }
  }, [loading]); 

  // Enquanto loading=true e o delay não passou: não renderiza nada (evita flash).
  // Enquanto o skeleton está no tempo mínimo -> continua nele.
  if (loading || showSkeleton) {
    return (
      <div className="skeleton-boundary" role="status" aria-busy="true" aria-live="polite">
        <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          {label}
        </span>
        {showSkeleton ? skeleton : null}
      </div>
    );
  }

  return <div className="skeleton-boundary skeleton-fade-in">{children}</div>;
}