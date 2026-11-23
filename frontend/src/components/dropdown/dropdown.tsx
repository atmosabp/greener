
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ChevronDown, Check } from "lucide-react";

import "./Dropdown.css";

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface BaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "dark" | "green";
}

interface SelectProps extends BaseProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

interface MultiSelectProps extends BaseProps {
  value: string[];
  options: DropdownOption[];
  onChange: (value: string[]) => void;
  emptyLabel?: string;
}

interface DropdownMenuProps extends BaseProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  renderOption?: (
    option: DropdownOption,
    selected: boolean
  ) => ReactNode;
}

function useDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        containerRef.current &&
        target instanceof Node &&
        !containerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return {
    open,
    setOpen,
    containerRef,
  };
}

function getSelectedLabel(
  value: string,
  options: DropdownOption[],
  placeholder: string
) {
  return (
    options.find((option) => option.value === value)?.label ??
    placeholder
  );
}

function getVariantClass(variant: BaseProps["variant"]) {
  return `gr-dropdown-${variant ?? "default"}`;
}

/* =========================================================
   SELECT - Seleção única
========================================================= */

export function Select({
  value,
  options,
  onChange,
  placeholder = "Selecione",
  disabled = false,
  className = "",
  variant = "default",
}: SelectProps) {
  const { open, setOpen, containerRef } = useDropdown();

  const selectedLabel = getSelectedLabel(
    value,
    options,
    placeholder
  );

  return (
    <div
      ref={containerRef}
      className={`gr-dropdown ${className}`}
    >
      <button
        type="button"
        className={`gr-dropdown-trigger ${getVariantClass(variant)}`}
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="gr-dropdown-value">
          {selectedLabel}
        </span>

        <ChevronDown
          size={17}
          className={`gr-dropdown-chevron ${
            open ? "is-open" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="gr-dropdown-panel"
          role="listbox"
        >
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled}
                className={`gr-dropdown-option ${
                  selected ? "is-selected" : ""
                } ${option.disabled ? "is-disabled" : ""}`}
                onClick={() => {
                  if (option.disabled) return;

                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>

                {selected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MULTI SELECT - Seleção múltipla
========================================================= */

export function MultiSelect({
  value,
  options,
  onChange,
  placeholder = "Selecione opções",
  emptyLabel = "Nenhuma opção selecionada",
  disabled = false,
  className = "",
  variant = "default",
}: MultiSelectProps) {
  const { open, setOpen, containerRef } = useDropdown();

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  function toggleOption(optionValue: string) {
    const option = options.find(
      (item) => item.value === optionValue
    );

    if (option?.disabled) return;

    const alreadySelected = value.includes(optionValue);

    if (alreadySelected) {
      onChange(
        value.filter((item) => item !== optionValue)
      );
    } else {
      onChange([...value, optionValue]);
    }
  }

  const triggerLabel =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length === 1
        ? selectedOptions[0].label
        : `${selectedOptions.length} serviços selecionados`;

  return (
    <div
      ref={containerRef}
      className={`gr-dropdown ${className}`}
    >
      <button
        type="button"
        className={`gr-dropdown-trigger ${getVariantClass(variant)}`}
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="gr-dropdown-value">
          {triggerLabel}
        </span>

        <ChevronDown
          size={17}
          className={`gr-dropdown-chevron ${
            open ? "is-open" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="gr-dropdown-panel gr-dropdown-multi-panel"
          role="group"
        >
          {options.map((option) => {
            const selected = value.includes(option.value);

            return (
              <label
                key={option.value}
                className={`gr-dropdown-option gr-dropdown-checkbox-option ${
                  selected ? "is-selected" : ""
                } ${option.disabled ? "is-disabled" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  disabled={option.disabled}
                  onChange={() => toggleOption(option.value)}
                />

                <span className="gr-dropdown-check">
                  {selected && <Check size={13} />}
                </span>

                <span>{option.label}</span>
              </label>
            );
          })}

          {selectedOptions.length === 0 && (
            <span className="gr-dropdown-empty">
              {emptyLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DROPDOWN MENU - Menu personalizado
========================================================= */

export function DropdownMenu({
  value,
  options,
  onChange,
  placeholder = "Selecione",
  disabled = false,
  className = "",
  variant = "green",
  renderOption,
}: DropdownMenuProps) {
  const { open, setOpen, containerRef } = useDropdown();

  const selectedLabel = getSelectedLabel(
    value,
    options,
    placeholder
  );

  return (
    <div
      ref={containerRef}
      className={`gr-dropdown ${className}`}
    >
      <button
        type="button"
        className={`gr-dropdown-trigger ${getVariantClass(variant)}`}
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="gr-dropdown-value">
          {selectedLabel}
        </span>

        <ChevronDown
          size={17}
          className={`gr-dropdown-chevron ${
            open ? "is-open" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="gr-dropdown-panel"
          role="listbox"
        >
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled}
                className={`gr-dropdown-option ${
                  selected ? "is-selected" : ""
                } ${option.disabled ? "is-disabled" : ""}`}
                onClick={() => {
                  if (option.disabled) return;

                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {renderOption ? (
                  renderOption(option, selected)
                ) : (
                  <>
                    <span>{option.label}</span>
                    {selected && <Check size={16} />}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
