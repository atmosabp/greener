
import type { RankingPeriod } from "../../pages/ranking/rankingData";
import { Select } from "../dropdown";
import "./PeriodSelect.css";

interface PeriodSelectProps {
  showSkeleton?: boolean;
  handlePeriodChange: (period: RankingPeriod) => void;
  period: RankingPeriod;
}

const periodOptions = [
  { label: "Agora", value: "now" },
  { label: "Última hora", value: "hour" },
  { label: "Dia", value: "today" },
  { label: "Esse mês", value: "month" },
  { label: "Esse ano", value: "year" },
];

export default function PeriodSelect({
  handlePeriodChange,
  period,
  showSkeleton
}: PeriodSelectProps) {
  return (
    <div className="period-select-container">
      <Select
        className=""
        variant="default"
        value={period}
        disabled={showSkeleton}
        options={periodOptions}
        onChange={(value) =>
          handlePeriodChange(value as RankingPeriod)
        }
      />
    </div>
  );
}
