import { useState } from "react";
import "./RankingCalendar.css";

import { hours, monthNames, weekDays, type RankingPeriod } from "./rankingData";
import { toLocalISOTime } from "../../../utils/history";

type LastHourSlotType = {
  hour: number;
  minute: number;
  label: string;
  date: Date;
};

type RankingCalendarProps = {
  period: RankingPeriod;
  selectedMinute: number;
  selectedHour: number;
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  viewMonth: number;
  viewYear: number;
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  currentHour: number;
  calendarDays: (number | null)[];
  lastHourSlots: LastHourSlotType[];
  onClose: () => void;
  onChangeMonth: (direction: number) => void;
  onConfirmDay: (day: number) => void;
  onConfirmMonth: (month: number) => void;
  onConfirmYear: (year: number) => void;
  onConfirmHour: (hour: number) => void;
  onConfirmMinute: (minute: number, hour?: number) => void;
  handleFetch: (periodType: string, datePull: Date | string) => void;
  handleCancel: () => void;
};

export default function RankingCalendar({
  period,
  selectedMinute,
  selectedHour,
  selectedDay,
  selectedMonth,
  viewMonth,
  viewYear,
  currentYear,
  currentMonth,
  currentDay,
  currentHour,
  calendarDays,
  lastHourSlots,
  onClose,
  onConfirmMinute,
  onConfirmHour,
  onConfirmDay,
  onConfirmMonth,
  handleFetch,
  handleCancel,
}: RankingCalendarProps) {
  const [draftDay, setDraftDay] = useState(selectedDay);
  const [draftMinute, setDraftMinute] = useState(selectedMinute);
  const [draftHour, setDraftHour] = useState(selectedHour);
  const [draftMonth, setDraftMonth] = useState(selectedMonth);
  const oppeningDate = new Date(); // pega a data atual da abertura da pagina

  const handleConfirm = () => {
    let date = new Date();
    if (period === "hour") {
      const selectedSlot =
        lastHourSlots.find((slot) => slot.minute === draftMinute) ??
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          currentHour,
          draftMinute,
        );

      const rawDate =
        selectedSlot instanceof Date ? selectedSlot : selectedSlot.date;

      const targetDate = new Date(rawDate);
      targetDate.setSeconds(0, 0);

      handleFetch("minute", toLocalISOTime(targetDate));
      onConfirmMinute(draftMinute, targetDate.getHours());
    } else if (period === "today") {
      handleFetch(
        "hour",
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          draftHour,
        ),
      );
      onConfirmHour(draftHour);
    } else if (period === "month") {
      handleFetch(
        "day",
        new Date(date.getFullYear(), date.getMonth(), draftDay),
      );
      onConfirmDay(draftDay);
    } else if (period === "year") {
      handleFetch("month", new Date(date.getFullYear(), draftMonth));
      onConfirmMonth(draftMonth);
    }
  };

  return (
    <div className="ranking-calendar-overlay">
      <section
        className="ranking-calendar-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ranking-calendar-title"
      >
        <button
          type="button"
          className="ranking-calendar-close"
          onClick={() => {
            onClose();
            handleCancel();
          }}
          aria-label="Fechar calendário"
        >
          ×
        </button>

        <h2 id="ranking-calendar-title">
          {period === "hour" && "Escolha um minuto"}
          {period === "today" && "Escolha um horário"}
          {period === "month" && "Escolha uma data"}
          {period === "year" && "Escolha um mês"}
          {period === "other-years" && "Escolha um ano"}
        </h2>

        {period === "hour" && (
          <div className="ranking-calendar-panel">
            <div className="ranking-calendar-options ranking-calendar-minute-options">
              {/* pega os minutos do slots e coloca em uma div */}
              {lastHourSlots.map((slot) => (
                <button
                  type="button"
                  key={`${slot.hour}-${slot.minute}-${slot.label}`}
                  className={draftMinute === slot.minute ? "is-selected" : ""}
                  disabled={slot.date.getTime() > oppeningDate.getTime()}
                  onClick={() => setDraftMinute(slot.minute)}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {period === "month" && (
          <>
            <div className="ranking-calendar-navigation">
              <strong>
                {monthNames[currentMonth]} {currentYear}
              </strong>
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
                      className={day === draftDay ? "is-selected" : ""}
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
                  className={draftHour === hour ? "is-selected" : ""}
                  disabled={hour > oppeningDate.getHours()}
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
                  className={draftMonth === index ? "is-selected" : ""}
                  onClick={() => setDraftMonth(index)}
                  disabled={index > oppeningDate.getMonth()}
                >
                  {month}
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
