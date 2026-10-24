
import { useState } from 'react';

import AppHeader from '../../components/header/AppHeader';

import {
  MOCK_SERVICES,
  PERIODS,
  STATIC_AVERAGES,
} from './comparisonData';

import type {
  Service,
  CompareTarget,
} from './comparisonData';

import {
  Chevron,
  Gauge,
  greeting,
  HelpIcon,
  Popover,
  SelectPill,
  StarIcon,
} from './components/ComparisonComponents';

import ServiceCard from './components/ServiceCard';

import './Comparison.css';

/* ------------------------------------------------------------------ */
/* Propriedades da página                                              */
/* ------------------------------------------------------------------ */

interface ComparisonProps {
  userName?: string;
  onLogout?: () => void;
}

/* ------------------------------------------------------------------ */
/* Página de comparação                                                */
/* ------------------------------------------------------------------ */

export default function Comparison({
  userName = 'Júlia',
}: ComparisonProps) {
  const [period, setPeriod] = useState('today');

  const [order, setOrder] = useState<string[]>(
    () => MOCK_SERVICES.map((service) => service.id),
  );

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(MOCK_SERVICES.map((service) => service.id)),
  );

  const [referenceId, setReferenceId] = useState<string | null>(
    'billing-api',
  );

  const [compareMap, setCompareMap] = useState<
    Record<string, CompareTarget>
  >({});

  /* Serviços selecionados na ordem atual. */
  const visible = order
    .filter((id) => selected.has(id))
    .map((id) => MOCK_SERVICES.find((service) => service.id === id))
    .filter((service): service is Service => service !== undefined);

  /* Selecionar ou desmarcar serviços. */
  const toggleSelected = (id: string) => {
    setSelected((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  /* Marcar ou remover a referência de um cartão. */
  const toggleReference = (id: string) => {
    setReferenceId((current) => (current === id ? null : id));
  };

  /* Mover um cartão para cima ou para baixo. */
  const move = (id: string, direction: -1 | 1) => {
    const visibleIndex = visible.findIndex(
      (service) => service.id === id,
    );

    const neighbor = visible[visibleIndex + direction];

    if (!neighbor) return;

    setOrder((previous) => {
      const next = [...previous];
      const currentIndex = next.indexOf(id);
      const neighborIndex = next.indexOf(neighbor.id);

      [next[currentIndex], next[neighborIndex]] = [
        next[neighborIndex],
        next[currentIndex],
      ];

      return next;
    });
  };

  return (
    <div className="cmp-comparison">
      <AppHeader />

      <main className="cmp-page">
        {/* ---------------------------------------------------------- */}
        {/* Cabeçalho e filtros                                        */}
        {/* ---------------------------------------------------------- */}

        <section className="cmp-intro">
          <div>
            <h1>
              {greeting()}, {userName}.
            </h1>

            <p className="cmp-intro__sub">
              Comparação de serviços
            </p>

            <Popover
              trigger={({ open, toggle }) => (
                <button
                  type="button"
                  className="cmp-pill-outline"
                  aria-expanded={open}
                  onClick={toggle}
                >
                  Serviços selecionados
                  <Chevron size={22} />
                </button>
              )}
            >
              {() => (
                <ul className="cmp-menu">
                  {MOCK_SERVICES.map((service) => (
                    <li key={service.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selected.has(service.id)}
                          onChange={() =>
                            toggleSelected(service.id)
                          }
                        />
                        {service.name}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </Popover>
          </div>

          <SelectPill
            variant="dark"
            label="Período"
            value={period}
            onChange={setPeriod}
            options={PERIODS}
          />
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Médias dos indicadores                                     */}
        {/* ---------------------------------------------------------- */}

        <section
          className="cmp-averages"
          aria-labelledby="avg-title"
        >
          <h2
            id="avg-title"
            className="cmp-averages__title"
          >
            Média indicadores
          </h2>

          <button
            type="button"
            className="cmp-averages__help"
            aria-label="Ajuda sobre os indicadores"
            title="Valores demonstrativos estáticos"
          >
            <HelpIcon />
          </button>

          <div className="cmp-averages__content">
            <div className="cmp-averages__tiles">
              <div className="cmp-avg-tile">
                <span>Rede</span>
                <strong>{STATIC_AVERAGES.rede}</strong>
              </div>

              <div className="cmp-avg-tile">
                <span>CPU</span>
                <strong>{STATIC_AVERAGES.cpu}</strong>
              </div>

              <div className="cmp-avg-tile">
                <span>Armazenamento</span>
                <strong>
                  {STATIC_AVERAGES.armazenamento}
                </strong>
              </div>

              <div className="cmp-avg-tile">
                <span>Memória</span>
                <strong>{STATIC_AVERAGES.memoria}</strong>
              </div>
            </div>

            <Gauge
              title="Consumo energético"
              value={STATIC_AVERAGES.consumo}
              unit=""
              fill="65"
            />

            <Gauge
              title="Emissão de CO₂e"
              value={STATIC_AVERAGES.emissao}
              unit=""
              fill="45"
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Serviços                                                    */}
        {/* ---------------------------------------------------------- */}

        <section
          className="cmp-services"
          aria-labelledby="services-title"
        >
          <div className="cmp-services__head">
            <h2 id="services-title">Serviços</h2>

            <div className="cmp-services__tools">
              <Popover
                align="right"
                trigger={({ open, toggle }) => (
                  <button
                    type="button"
                    className="cmp-chip cmp-chip--wide"
                    aria-expanded={open}
                    onClick={toggle}
                  >
                    Escolher serviço referência
                    <StarIcon size={24} />
                  </button>
                )}
              >
                {(close) => (
                  <ul className="cmp-menu">
                    {visible.map((service) => (
                      <li key={service.id}>
                        <button
                          type="button"
                          className={
                            service.id === referenceId
                              ? 'cmp-is-active'
                              : ''
                          }
                          onClick={() => {
                            setReferenceId(service.id);
                            close();
                          }}
                        >
                          {service.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Popover>
            </div>
          </div>

          <div className="cmp-services__scroll">
            {visible.length === 0 && (
              <p className="cmp-empty">
                Nenhum serviço selecionado. Escolha ao menos um em
                “Serviços selecionados”.
              </p>
            )}

            {visible.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                rank={index + 1}
                isFirst={index === 0}
                isLast={index === visible.length - 1}
                isReference={service.id === referenceId}
                compareWith={
                  compareMap[service.id] ?? 'reference'
                }
                hasReference={
                  referenceId !== null &&
                  referenceId !== service.id
                }
                onMove={(direction) =>
                  move(service.id, direction)
                }
                onToggleReference={() =>
                  toggleReference(service.id)
                }
                onCompareChange={(target) =>
                  setCompareMap((previous) => ({
                    ...previous,
                    [service.id]: target,
                  }))
                }
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="cmp-footer">
        Desenvolvido por Atmos © 2026
      </footer>
    </div>
  );
}
