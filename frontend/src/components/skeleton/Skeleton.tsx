import "./Skeleton.css";
import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  circle?: boolean;
  className?: string;
  style?: CSSProperties;
}


// Bloco cinza animado -> é a única "peça" que cada página precisa para montar seu próprio skeleton.
export function Skeleton({
  width = "100%",
  height = "1rem",
  radius,
  circle,
  className = "",
  style,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`skeleton ${circle ? "skeleton--circle" : ""} ${className}`}
      style={{
        width,
        height,
        ...(radius !== undefined && { ["--skeleton-radius" as string]: typeof radius === "number" ? `${radius}px` : radius }),
        ...style,
      }}
    />
  );
}

/** Atalho: várias linhas de texto (a última é mais curta, como um parágrafo real). */
export function SkeletonText({ lines = 3, gap = 8 }: { lines?: number; gap?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height="0.9rem" width={i === lines - 1 && lines > 1 ? "60%" : "100%"} />
      ))}
    </div>
  );
}