import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Palette, RotateCcw } from "lucide-react";
import "./ThemeToggle.css";
import useTheme from "../../hooks/useTheme";

type PaletteName = "green" | "custom";

// verde e azul usam as paletas do index.css -> as demais são personalizadas (hsl)
const presets: {
  name: string;
  hue: number;
  sat: number;
  palette?: "green";
}[] = [
  { name: "green", hue: 100, sat: 38, palette: "green" },
  { name: "blue", hue: 210, sat: 38 },
  { name: "pink", hue: 345, sat: 38 },
  { name: "purple", hue: 261, sat: 38 },
  { name: "orange", hue: 25, sat: 38 },
];

const default_palette: PaletteName = "green";
const default_hue = 100;
const default_sat = 38;

const custom_vars = [
  "--primary",
  "--primary-light",
  "--primary-dark",
  "--primary-darker",
  "--focus-ring",
  "--on-primary",
  "--on-primary-light",
  "--on-primary-dark",
  "--on-primary-darker",
  "--background",
  "--background-transparent",
  "--complementary",
];

function clearCustomPalette() {
  const root = document.documentElement;
  custom_vars.forEach((v) => root.style.removeProperty(v));
}

// Contraste automático (WCAG)

const text_dark = "#38322E";
const text_light = "#F9EEDC";

function channelToLinear(value: number) {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number) {
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

function hexLuminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return relativeLuminance((n >> 16) & 255, (n >> 8) & 255, n & 255);
}

function contrastRatio(l1: number, l2: number) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Escolhe texto claro ou escuro (o que tiver mais contraste com o fundo)
function pickTextFromRgb(r: number, g: number, b: number) {
  const bg = relativeLuminance(r, g, b);
  const withDark = contrastRatio(bg, hexLuminance(text_dark));
  const withLight = contrastRatio(bg, hexLuminance(text_light));
  return withDark >= withLight ? text_dark : text_light;
}

// Para cada fundo da paleta, cria a variável de texto correspondente
const contrast_pairs: [string, string][] = [
  ["--primary", "--on-primary"],
  ["--primary-light", "--on-primary-light"],
  ["--primary-dark", "--on-primary-dark"],
  ["--primary-darker", "--on-primary-darker"],
];

// Converte o valor computado pelo navegador ("rgb(...)", "rgba(...)" ou "color(srgb ...)") em [r, g, b] de 0 a 255
function parseColor(value: string): [number, number, number] | null {
  const nums = value.match(/-?\d*\.?\d+/g);
  if (!nums || nums.length < 3) return null;
  const [a, b, c] = nums.slice(0, 3).map(Number);
  return value.startsWith("color(") ? [a * 255, b * 255, c * 255] : [a, b, c];
}

// Lê a cor que o navegador está usando e define o texto com melhor contraste. Vale para qualquer paleta.
// IMPORTANTE: o index.css tem "transition: background-color" em todas as <div>. Sem desligar a transição
// na div de teste, getComputedStyle devolve a cor ANTIGA (transparente = preto) e o texto sempre saía claro.
function applyContrastVars() {
  const root = document.documentElement;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;transition:none !important;";
  document.body.appendChild(probe);

  for (const [bgVar, onVar] of contrast_pairs) {
    probe.style.backgroundColor = `var(${bgVar})`;
    const rgb = parseColor(getComputedStyle(probe).backgroundColor);
    if (!rgb) continue;
    root.style.setProperty(onVar, pickTextFromRgb(...rgb));
  }

  const cache: Record<string, string> = {};
  for (const [, onVar] of contrast_pairs) {
    cache[onVar] = root.style.getPropertyValue(onVar);
  }
  localStorage.setItem("contrast-vars", JSON.stringify(cache));
  
  probe.remove();
}

function applyCustomPalette(hue: number, sat: number, mode: string) {
  const root = document.documentElement;
  const isDark = mode === "dark";

  root.style.setProperty(
    "--primary",
    `hsl(${hue}, ${sat}%, ${isDark ? 65 : 48}%)`,
  );
  root.style.setProperty("--primary-light", `hsl(${hue}, ${sat}%, 75%)`);
  root.style.setProperty(
    "--primary-dark",
    `hsl(${hue}, ${sat}%, ${isDark ? 45 : 35}%)`,
  );
  root.style.setProperty("--primary-darker", `hsl(${hue}, ${sat}%, 25%)`);
  root.style.setProperty(
    "--focus-ring",
    `hsl(${hue}, ${sat}%, ${isDark ? 75 : 30}%)`,
  );

  if (isDark) {
    const tint = Math.round(sat * 0.25);
    root.style.setProperty("--background", `hsl(${hue}, ${tint}%, 18%)`);
    root.style.setProperty(
      "--background-transparent",
      `hsla(${hue}, ${tint}%, 12%, 0.5)`,
    );
    root.style.setProperty("--complementary", `hsl(${hue}, ${tint}%, 14%)`);
  } else {
    root.style.removeProperty("--background");
    root.style.removeProperty("--background-transparent");
    root.style.removeProperty("--complementary");
  }
}

function swatchColor(preset: (typeof presets)[number]) {
  if (preset.palette === "green") return "var(--theme-primary)";
  if (preset.palette === "blue") return "var(--theme-secondary)";
  return `hsl(${preset.hue}, ${preset.sat}%, 48%)`;
}

export default function ThemeToggle() {
  const { mode, changeMode } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const [palette, setPalette] = useState<PaletteName>(() => {
    const saved = localStorage.getItem("palette");
    return saved === "green" || saved === "custom" ? saved : default_palette;
  });

  const [hue, setHue] = useState(() =>
    Number(localStorage.getItem("custom-hue") ?? default_hue),
  );
  const [sat, setSat] = useState(() =>
    Number(localStorage.getItem("custom-sat") ?? default_sat),
  );

  useEffect(() => {
    const root = document.documentElement;

    if (palette === "custom") {
      root.removeAttribute("data-palette");
      applyCustomPalette(hue, sat, mode);
    } else {
      clearCustomPalette();
      root.setAttribute("data-palette", palette);
    }

    applyContrastVars();

    localStorage.setItem("palette", palette);
    localStorage.setItem("custom-hue", String(hue));
    localStorage.setItem("custom-sat", String(sat));
  }, [palette, hue, sat, mode]);

  function selectPreset(preset: (typeof presets)[number]) {
    setHue(preset.hue);
    setSat(preset.sat);
    setPalette(preset.palette ?? "custom");
  }

  function changeHue(value: number) {
    setHue(value);
    setPalette("custom");
  }

  function changeSat(value: number) {
    setSat(value);
    setPalette("custom");
  }

  function resetPalette() {
    setPalette(default_palette);
    setHue(default_hue);
    setSat(default_sat);
  }

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="toggle-theme" ref={containerRef}>
      <button
        className="btn-theme"
        onClick={() => changeMode(mode === "light" ? "dark" : "light")}
        title="Alternar tema"
        aria-label="Alternar modo claro e escuro"
      >
        <div className={`toggle ${mode}`}>
          {mode === "light" ? <Sun size={18} /> : <Moon size={18} />}
        </div>
      </button>

      <button
        className="btn-palette"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Personalizar cores"
        aria-expanded={isOpen}
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="palette-panel">
          <span>
            Personalizar cores{" "}
            <button className="btn-reset" onClick={resetPalette}>
              <RotateCcw size={14} />
            </button>
          </span>

          <div className="palette-presets">
            {presets.map((preset) => {
              const selected = preset.palette
                ? palette === preset.palette
                : palette === "custom" && hue === preset.hue;

              return (
                <button
                  key={preset.name}
                  className={`preset ${selected ? "selected" : ""}`}
                  style={{ backgroundColor: swatchColor(preset) }}
                  onClick={() => selectPreset(preset)}
                  title={preset.name}
                  aria-label={preset.name}
                  aria-pressed={selected}
                />
              );
            })}
          </div>

          <label htmlFor="hue-slider">Personalize o matiz</label>

          <input
            id="hue-slider"
            className="hue-slider"
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(event) => changeHue(Number(event.target.value))}
            style={{ accentColor: "var(--primary)" }}
          />

          <label htmlFor="sat-slider">Personalize a saturação</label>

          <input
            id="sat-slider"
            type="range"
            min="0"
            max="100"
            value={sat}
            onChange={(event) => changeSat(Number(event.target.value))}
            style={{ accentColor: "var(--primary)" }}
          />

          <div className="palette-preview">
            <span>Prévia da cor</span>
            <div
              className="preview-color"
              style={{ backgroundColor: "var(--primary)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
