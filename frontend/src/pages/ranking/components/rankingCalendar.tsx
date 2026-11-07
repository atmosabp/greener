import { useState } from "react";

import {
    availableYears,
    hours,
    monthNames,
    weekDays,
    type RankingPeriod,
} from "./rankingData";

type RankingCalendarProps = {
    period: RankingPeriod;
    selectedHour: number;
    selectedDay: number;
    selectedMonth: number;
    selectedYear: number;
    viewMonth: number;
    viewYear: number;
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    calendarDays: (number | null)[];
    onClose: () => void;
    onChangeMonth: (direction: number) => void;
    onConfirmDay: (day: number) => void;
    onConfirmMonth: (month: number) => void;
    onConfirmYear: (year: number) => void;
    onConfirmHour: (hour: number) => void;
};

export default function RankingCalendar({
    period,
    selectedHour,
    selectedDay,
    selectedMonth,
    selectedYear,
    viewMonth,
    viewYear,
    currentYear,
    currentMonth,
    currentDay,
    calendarDays,
    onClose,
    onChangeMonth,
    onConfirmDay,
    onConfirmMonth,
    onConfirmYear,
    onConfirmHour,
}: RankingCalendarProps) {
    const [draftDay, setDraftDay] = useState(selectedDay);
    const [draftHour, setDraftHour] = useState(selectedHour);
    const [draftMonth, setDraftMonth] = useState(selectedMonth);
    const [draftYear, setDraftYear] = useState(selectedYear);

    const handleConfirm = () => {
        if (period === "today") {
            onConfirmHour(draftHour);
        } else if (period === "month") {
            onConfirmDay(draftDay);
        } else if (period === "year") {
            onConfirmMonth(draftMonth);
        } else if (period === "other-years") {
            onConfirmYear(draftYear);
        }
    };

    return (
        <div
            className="ranking-calendar-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                className="ranking-calendar-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ranking-calendar-title"
            >
                <button
                    type="button"
                    className="ranking-calendar-close"
                    onClick={onClose}
                    aria-label="Fechar calendário"
                >
                    ×
                </button>

                <h2 id="ranking-calendar-title">
                    {period === "today" && "Escolha um horário"}
                    {period === "month" && "Escolha uma data"}
                    {period === "year" && "Escolha um mês"}
                    {period === "other-years" && "Escolha um ano"}
                </h2>

                {period === "month" && (
                    <>
                        <div className="ranking-calendar-navigation">
                            <button
                                type="button"
                                onClick={() => onChangeMonth(-1)}
                                aria-label="Mês anterior"
                                disabled
                            >
                                ‹
                            </button>

                            <strong>
                                {monthNames[currentMonth]} {currentYear}
                            </strong>

                            <button
                                type="button"
                                onClick={() => onChangeMonth(1)}
                                aria-label="Próximo mês"
                                disabled
                            >
                                ›
                            </button>
                        </div>

                        <div className="ranking-calendar-panel">
                            <div className="ranking-calendar-days">
                                {weekDays.map((day, index) => (
                                    <span key={`${day}-${index}`}>{day}</span>
                                ))}

                                {calendarDays.map((day, index) =>
                                    day === null ? (
                                        <span
                                            className="ranking-calendar-empty"
                                            key={`empty-${index}`}
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            key={day}
                                            disabled={
                                                viewYear === currentYear &&
                                                viewMonth === currentMonth &&
                                                day > currentDay
                                            }
                                            className={
                                                day === draftDay
                                                    ? "is-selected"
                                                    : ""
                                            }
                                            onClick={() => setDraftDay(day)}
                                        >
                                            {day}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    </>
                )}

                {period === "today" && (
                    <div className="ranking-calendar-panel">
                        <div className="ranking-calendar-options ranking-calendar-hour-options">
                            {hours.map((hour) => (
                                <button
                                    type="button"
                                    key={hour}
                                    className={
                                        draftHour === hour ? "is-selected" : ""
                                    }
                                    onClick={() => setDraftHour(hour)}
                                >
                                    {String(hour).padStart(2, "0")}:00
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {period === "year" && (
                    <div className="ranking-calendar-panel">
                        <div className="ranking-calendar-options ranking-calendar-month-options">
                            {monthNames.map((month, index) => (
                                <button
                                    type="button"
                                    key={month}
                                    className={
                                        draftMonth === index ? "is-selected" : ""
                                    }
                                    onClick={() => setDraftMonth(index)}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {period === "other-years" && (
                    <div className="ranking-calendar-panel">
                        <div className="ranking-calendar-options ranking-calendar-year-options">
                            {availableYears.map((year) => (
                                <button
                                    type="button"
                                    key={year}
                                    className={
                                        draftYear === year ? "is-selected" : ""
                                    }
                                    onClick={() => setDraftYear(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    className="ranking-calendar-confirm"
                    onClick={handleConfirm}
                >
                    Confirmar seleção
                </button>
            </section>
        </div>
    );
}