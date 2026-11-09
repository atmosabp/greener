// Importações
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "./Calendar.css";

// Tipagem para o calendário
interface CalendarProps {
  onSelect: (date: string) => void;
  onClose: () => void;
}

// Dias da semana (para aparecer bonitinho no calendário)
const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];

function Calendar({ onSelect, onClose }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>("");

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // Monta um array com todos os dias do mês, até os espaços vazios antes do dia 1 -> os dias do mês como um calendário mesmo
  const days: (number | null)[] = [
    ...Array<number | null>(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Formata a data
  function formatDate(day: number): string {
    const month = String(currentMonth + 1).padStart(2, "0"); // padStart -> garante que tenha dois digitos, colocando um zero a esquerda
    const formattedDay = String(day).padStart(2, "0");

    return `${formattedDay}-${month}-${currentYear}`;
  }

  // função quando a pessoa clica na seta para voltar um mês.
  function handlePreviousMonth(): void {
    const date = new Date(currentYear, currentMonth - 1, 1);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
  }

  // função quando a pessoa clica na seta para avançar um mês.

  function handleNextMonth(): void {
    const date = new Date(currentYear, currentMonth + 1, 1);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
  }

  // Verifica se é o mês atual para bloquear a seta de avançar
  const isCurrentMonth =
    currentMonth === today.getMonth() && currentYear === today.getFullYear();

  // Confirma a data selecionada
  function handleConfirm(): void {
    if (selectedDate) {
      onSelect(selectedDate);
      onClose();
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="calendar-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="close-modal"
          onClick={onClose}
          aria-label="Fechar calendário"
        >
          <X />
        </button>

        <h2>Escolha uma data</h2>

        <div className="calendar-header">
          <button
            type="button"
            onClick={handlePreviousMonth}
            aria-label="Mês anterior"
          >
            <ChevronLeft />
          </button>

          <span>
            {monthNames[currentMonth]} {currentYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            aria-label="Próximo mês"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="calendar">
          {weekdays.map((day, index) => (
            <span className="weekday" key={index}>
              {day}
            </span>
          ))}

          {days.map((day, index) => {
            const dateValue = day ? formatDate(day) : "";

            const isFutureDate =
              day !== null && new Date(currentYear, currentMonth, day) > today;

            const isSelected = dateValue === selectedDate;

            return (
              <button
                type="button"
                key={index}
                className={`day ${isSelected ? "selected" : ""}`}
                disabled={day === null || isFutureDate}
                onClick={() => {
                  if (day !== null && !isFutureDate) {
                    setSelectedDate(dateValue);
                  }
                }}
              >
                {day ?? ""}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="confirm-button"
          onClick={handleConfirm}
          disabled={!selectedDate}
        >
          Ver dashboard
        </button>
      </div>
    </div>
  );
}

export default Calendar;
