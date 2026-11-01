
import { useMemo, useState } from "react";

import type { RankingPeriod } from "./rankingData";

export default function useRankingCalendar() {
    const [calendarOpen, setCalendarOpen] = useState(false);

    const [selectedHour, setSelectedHour] = useState(() =>
        new Date().getHours(),
    );
    const [selectedDay, setSelectedDay] = useState(() =>
        new Date().getDate(),
    );
    const [selectedMonth, setSelectedMonth] = useState(() =>
        new Date().getMonth(),
    );
    const [selectedYear, setSelectedYear] = useState(() =>
        new Date().getFullYear(),
    );

    const [viewMonth, setViewMonth] = useState(() =>
        new Date().getMonth(),
    );
    const [viewYear, setViewYear] = useState(() =>
        new Date().getFullYear(),
    );

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    const calendarDays = useMemo(() => {
        const daysInMonth = new Date(
            viewYear,
            viewMonth + 1,
            0,
        ).getDate();

        const firstWeekDay = new Date(
            viewYear,
            viewMonth,
            1,
        ).getDay();

        return [
            ...Array.from({ length: firstWeekDay }, () => null),
            ...Array.from(
                { length: daysInMonth },
                (_, index) => index + 1,
            ),
        ] as (number | null)[];
    }, [viewYear, viewMonth]);

    function openCalendar(period: RankingPeriod) {
        if (period === "now") {
            setCalendarOpen(false);
            return;
        }

        // Sempre abre no período atual.
        setViewMonth(currentMonth);
        setViewYear(currentYear);
        setCalendarOpen(true);
    }

    function closeCalendar() {
        setCalendarOpen(false);
    }

    function changeMonth(direction: number, period: RankingPeriod) {
        // "Esse mês" permite apenas o mês atual.
        if (period === "month") return;

        const nextDate = new Date(
            viewYear,
            viewMonth + direction,
            1,
        );

        const nextYear = nextDate.getFullYear();
        const nextMonth = nextDate.getMonth();

        // Impede navegar para o futuro ou antes de 2010.
        if (
            nextYear > currentYear ||
            (nextYear === currentYear && nextMonth > currentMonth) ||
            nextYear < 2010
        ) {
            return;
        }

        setViewMonth(nextMonth);
        setViewYear(nextYear);
    }

    function confirmDay(day: number) {
        setSelectedDay(day);
        setSelectedMonth(viewMonth);
        setSelectedYear(viewYear);
        closeCalendar();
    }

    function confirmMonth(month: number) {
        setSelectedMonth(month);
        setSelectedYear(currentYear);
        closeCalendar();
    }

    function confirmYear(year: number) {
        setSelectedYear(year);
        closeCalendar();
    }

    function confirmHour(hour: number) {
        setSelectedHour(hour);
        closeCalendar();
    }

    return {
        calendarOpen,
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
        openCalendar,
        closeCalendar,
        changeMonth,
        confirmDay,
        confirmMonth,
        confirmYear,
        confirmHour,
    };
}
