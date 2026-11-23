import { useMemo } from "react";
import "./ClockPicker.css";

export type ClockSlot = {
  hour: number;
  minute: number;
  label: string;
  date: Date;
};

export type ClockValue = { hour: number; minute: number };

interface ClockPickerProps {
  slots: ClockSlot[];
  value: ClockValue;
  onChange: (value: ClockValue) => void;
}

interface ColumnProps {
  items: number[];
  selected: number;
  onSelect: (n: number) => void;
}

//coluna para hora e minuto (onde ficam os números)
function ClockColumn({ items, selected, onSelect }: ColumnProps) {
  const index = items.indexOf(selected); //index do tempo selecionado

  const prevTime = items[index - 1]; //valor anterior
  const nextTime = items[index + 1]; //valor posterior

  //adiciona 0 antes do número pra ficar com duas casas sempre (formatação)
  function addPad(n: number) {
    return String(n).padStart(2, "0");
  }

  //aumenta ou diminui o valor dependendo da rodinha do mouse
  function changeTime(step: number) {
    const target = items[index + step];

    if (target !== undefined) onSelect(target); //caso exista o novo valor, altera ele realmente
  }

  return (
    <div
      className="clock-column"
      onWheel={(e) => changeTime(e.deltaY > 0 ? 1 : -1)} //e.deltaY é tipo a rotação da roda do mouse
    >
      {/* botão tempo anterior */}
      <button
        type="button"
        className="clock-item clock-item-side"
        onClick={() => changeTime(-1)}
      >
        {prevTime !== undefined ? addPad(prevTime) : ""}
      </button>

      {/* tempo selecionado */}
      <span className="clock-item clock-item-current">{addPad(selected)}</span>

      {/* botão tempo posterior */}
      <button
        type="button"
        className="clock-item clock-item-side"
        onClick={() => changeTime(1)}
      >
        {nextTime !== undefined ? addPad(nextTime) : ""}
      </button>
    </div>
  );
}

export default function ClockPicker({
  slots,
  value,
  onChange,
}: ClockPickerProps) {
  //cria uma lista com as horas recebidas
  const hours = useMemo(
    () => Array.from(new Set(slots.map((s) => s.hour))),
    [slots],
  );

  //função para pegar os minutos daquela hora
  const minutesOf = (hour: number) =>
    slots.filter((slot) => slot.hour === hour).map((slot) => slot.minute);

  //array com os minutos da hora
  const minutes = minutesOf(value.hour);

  //função para mudar a hora
  function changeHour(hour: number) {
    const available = minutesOf(hour);

    const minute = available.includes(value.minute)
      ? value.minute
      : available.reduce((best, m) =>
          Math.abs(m - value.minute) < Math.abs(best - value.minute) ? m : best,
        );
    onChange({ hour, minute });
  }

  return (
    <div className="clock-picker">
      <ClockColumn 
        items={hours} 
        selected={value.hour} 
        onSelect={changeHour} 
      />

      <span className="clock-separator">:</span>

      <ClockColumn
        items={minutes}
        selected={value.minute}
        onSelect={(minute) => onChange({ hour: value.hour, minute })}
      />
    </div>
  );
}
