import { useMemo, useState } from "react";

import type { RankingPeriod } from "./rankingData";

export default function useRankingCalendar() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [selectedMinute, setSelectedMinute] = useState(() => new Date().getMinutes());
  const [selectedHour, setSelectedHour] = useState(() => new Date().getHours());
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear(),
  );

  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const currentHour = now.getHours();
  const currentTimestamp = now.getTime();

  // para o calendário de minutos -> useMemo serve para guardar os minutos da última hora, 
  // evitando que recarregue desnecessariamente a cada re-render
  const lastHourSlots = useMemo(() => {
    const baseTime = new Date(currentTimestamp);

    return Array.from({ length: 60 }, (_, index) => {
      const offsetMinutes = index - 59;
      const slotDate = new Date(
        baseTime.getTime() + offsetMinutes * 60 * 1000,
      );
      return {
        hour: slotDate.getHours(),
        minute: slotDate.getMinutes(),
        label: `${String(slotDate.getHours()).padStart(2, "0")}:${String(
          slotDate.getMinutes(),
        ).padStart(2, "0")}`,
        date: slotDate,
      };
    });
  }, [currentTimestamp]);

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const firstWeekDay = new Date(viewYear, viewMonth, 1).getDay();

    return [
      ...Array.from({ length: firstWeekDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ] as (number | null)[];
  }, [viewYear, viewMonth]);

  function openCalendar(period: RankingPeriod) {
    if (period === "now") {
      setCalendarOpen(false);
      return;
    }
    
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

    const nextDate = new Date(viewYear, viewMonth + direction, 1);

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

  function confirmMinute(minute: number, hour = currentHour) {
    setSelectedMinute(minute);
    setSelectedHour(hour);
    closeCalendar();
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
    selectedMinute,
    selectedHour,
    selectedDay,
    selectedMonth,
    selectedYear,
    viewMonth,
    viewYear,
    currentYear,
    currentMonth,
    currentDay,
    currentHour,
    calendarDays,
    lastHourSlots,
    openCalendar,
    closeCalendar,
    changeMonth,
    confirmDay,
    confirmMonth,
    confirmYear,
    confirmHour,
    confirmMinute
  };
}
