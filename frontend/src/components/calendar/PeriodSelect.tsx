import { useRef } from "react";
import type { RankingPeriod } from "../../pages/ranking/components/rankingData";
import "./PeriodSelect.css";

interface PeriodSelectProps {
  showSkeleton: any;
  handlePeriodChange: any;
  period: any;
}

export default function PeriodSelect({
  showSkeleton,
  handlePeriodChange,
  period,
}: PeriodSelectProps) {
  const wasOpenRef = useRef(false);

  return (
    <div className="period-select-container">
      <select
        className={`${showSkeleton ? "blocked " : ""}`}
        disabled={showSkeleton}
        name="date"
        id="period-select"
        value={period}
        onMouseDown={(event) => {
          wasOpenRef.current = document.activeElement === event.currentTarget;
        }}
        onChange={(event) =>
          handlePeriodChange(event.target.value as RankingPeriod)
        }
        onClick={(event) => {
          const currentValue = event.currentTarget.value as RankingPeriod;
          if (wasOpenRef.current && currentValue === period) {
            handlePeriodChange(currentValue);
          }
        }}
        onBlur={() => {
          wasOpenRef.current = false;
        }}
      >
        <option value="now">Agora</option>
        <option value="hour">Última hora</option>
        <option value="today">Hoje</option>
        <option value="month">Esse mês</option>
        <option value="year">Esse ano</option>
      </select>
    </div>
  );
}
