import { useState, useEffect, type ChangeEvent } from "react";

import AppHeader from "../../components/header/AppHeader";

import RankingCalendar from "./components/rankingCalendar";
import useRankingCalendar from "./components/useRankingCalendar";

import {
  monthNames,
  numberFormatter,
  timeFormatter,
  type RankingMetric,
  type RankingPeriod,
  type RankingService,
} from "./components/rankingData";

import "./Ranking.css";

export default function Ranking() {
  const [initialServices, setInitialServices] = useState<RankingService[]>([]);
  const [period, setPeriod] = useState<RankingPeriod>("now");
  const [metric, setMetric] = useState<RankingMetric>("energy");
  const [updateInterval, setUpdateInterval] = useState(5);
  const [lastUpdate, setLastUpdate] = useState(() => new Date());

  const calendar = useRankingCalendar();

  function handlePeriodChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextPeriod = event.target.value as RankingPeriod;

    setPeriod(nextPeriod);
    calendar.openCalendar(nextPeriod);
  }

  function handleUpdateIntervalChange(new_time: number) {
    setUpdateInterval(new_time);
    localStorage.setItem("refresh_interval", String(new_time));
    window.location.reload();
  }

  async function handleRefresh() {
    setLastUpdate(new Date());
    await fetchServices();
  }

  async function fetchServices() {
    setUpdateInterval(Number(localStorage.getItem("refresh_interval")));
    
    var formatedData: RankingService[] = [];

    const port: number = import.meta.env.VITE_PORT || 3000;

    const result = await fetch(
      `http://localhost:${port}/collections/all-service-data`,
    );
    const data = await result.json();

    for (let service of data) {
      formatedData.push({
        id: service.id,
        name: service.name,
        energy: service.metrics.kwh,
        co2e: service.metrics.co2e,
      });
    }

    setLastUpdate(new Date());


    sortRanking(formatedData)
    // setInitialServices(
    //   formatedData.sort((a, b) =>
    //     metric === "energy" ? b.energy - a.energy : b.co2e - a.co2e,
    //   ),
    // );
  }

  function handleParamChange(param:RankingMetric){
    setMetric(param);
    sortRanking(initialServices)
  }

  function sortRanking(data:RankingService[]){
    var key: (x: undefined | number) => undefined | number = x => x
    setInitialServices(
      data.sort((a, b) => {
        if(metric === "energy"){
          const xKey = key(a.energy), yKey = key(b.energy);
          if(typeof xKey === 'undefined') {
              return typeof yKey === 'string' ? 0 : 1;
          } else {
              return typeof yKey === 'string' ? -1 : yKey! - xKey!;
          }
        }else{
          const xKey = key(a.co2e), yKey = key(b.co2e);
          if(typeof xKey === 'undefined') {
              return typeof yKey === 'string' ? 0 : 1;
          } else {
              return typeof yKey === 'string' ? -1 : yKey! - xKey!;
          }
        } 
  }),
    );
  }

  const periodLabel: Record<RankingPeriod, string> = {
    now: "Agora",
    today: `Hoje às ${String(calendar.selectedHour).padStart(2, "0")}:00`,
    month: `${calendar.selectedDay} de ${
      monthNames[calendar.selectedMonth]
    } de ${calendar.selectedYear}`,
    year: `${monthNames[calendar.selectedMonth]} de ${calendar.selectedYear}`,
    "other-years": String(calendar.selectedYear),
  };

  const formattedLastUpdate = timeFormatter.format(lastUpdate);

  useEffect(() => {
    fetchServices();
    const fetchTimer = setInterval(
      fetchServices,
      (localStorage.getItem("refresh_interval")
        ? Number(localStorage.getItem("refresh_interval"))
        : updateInterval) * 1000,
    );

    return () => clearInterval(fetchTimer);
  }, []);

  return (
    <div className="ranking-page">
      <AppHeader />

      <main className="ranking-main">
        <div className="ranking-intro-box">
          <section className="ranking-intro">
            <div className="ranking-heading">
              <h1>Ranking</h1>
              <p>Veja o ranking de desempenho dos serviços.</p>
            </div>

            <div className="ranking-filters">
              <div className="ranking-period">
                <label htmlFor="ranking-period-select">
                  Ver ranking por período:
                </label>

                <select
                  id="ranking-period-select"
                  value={period}
                  onChange={handlePeriodChange}
                >
                  <option value="now">Agora</option>
                  <option value="today">Hoje</option>
                  <option value="month">Esse mês</option>
                  <option value="year">Esse ano</option>
                  <option value="other-years">Outros anos</option>
                </select>
              </div>

              <div className="ranking-classification">
                <span>Classificar por:</span>

                <div className="ranking-classification-buttons">
                  <button
                    type="button"
                    className={
                      metric === "energy"
                        ? "ranking-metric-button is-active"
                        : "ranking-metric-button"
                    }
                    aria-pressed={metric === "energy"}
                    onClick={() => {handleParamChange("energy")}}
                  >
                    Consumo energético
                  </button>

                  <button
                    type="button"
                    className={
                      metric === "co2e"
                        ? "ranking-metric-button is-active"
                        : "ranking-metric-button"
                    }
                    aria-pressed={metric === "co2e"}
                    onClick={() => {handleParamChange("co2e")}}
                  >
                    Emissão de CO₂e
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="ranking-toolbar">
            <div className="ranking-update">
              <label htmlFor="ranking-update-select">Atualizações:</label>

              <select
                id="ranking-update-select"
                value={Number(updateInterval)}
                onChange={(event) =>
                  handleUpdateIntervalChange(Number(event.target.value))
                }
              >
                <option value={5}>05s</option>
                <option value={10}>10s</option>
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
                <option value={120}>120s</option>
              </select>
            </div>

            <div className="ranking-toolbar-info">
              <span className="ranking-last-update">
                Última atualização: {formattedLastUpdate}
              </span>

              <button
                type="button"
                className="ranking-refresh-button"
                onClick={handleRefresh}
                aria-label="Atualizar horário da última atualização"
                title="Atualizar"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 7v5h-5" />
                  <path d="M4 17v-5h5" />
                  <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12" />
                  <path d="M4 12l2.8 5a7 7 0 0 0 11.6-2" />
                </svg>
              </button>
            </div>
          </section>
        </div>

        <section
          className="ranking-table-section"
          aria-label="Classificação dos serviços"
        >
          <div
            className="ranking-table-scroll"
            role="region"
            aria-label="Tabela de ranking. Role para ver todos os serviços."
            tabIndex={0}
          >
            <table className="ranking-table">
              <thead>
                <tr>
                  <th scope="col">Posição</th>
                  <th scope="col">Serviço</th>
                  <th scope="col">Consumo Energético</th>
                  <th scope="col">Emissão de CO₂e</th>
                </tr>
              </thead>

              <tbody>
                {initialServices
                  ? initialServices.map((service, index) => (
                      <tr key={service.id}>
                        <td>
                          <span
                            className={
                              index < 3
                                ? `ranking-position ranking-position--${index + 1}`
                                : "ranking-position"
                            }
                          >
                            #{index + 1}
                          </span>
                        </td>

                        <td className="ranking-service-name">{service.name}</td>

                        <td>
                          {numberFormatter.format(service.energy) != "NaN"
                            ? numberFormatter.format(service.energy)+" kWh"
                            : "Indisponível"}{" "}
                        </td>

                        <td>
                          {numberFormatter.format(service.co2e) != "NaN"
                            ? (numberFormatter.format(service.co2e)+" kg CO₂e")
                            : "Indisponível"}{" "}
                        </td>
                      </tr>
                    ))
                  : "não foi possível pegar os serviços"}
              </tbody>
            </table>
          </div>

          <div className="ranking-table-caption">
            <span>Período selecionado: {periodLabel[period]}</span>
            <span>{initialServices ? initialServices.length : 0} serviços encontrados</span>
          </div>
        </section>
      </main>

      <footer className="ranking-footer">Desenvolvido por Atmos © 2026</footer>

      {calendar.calendarOpen && (
        <RankingCalendar
          period={period}
          selectedHour={calendar.selectedHour}
          selectedDay={calendar.selectedDay}
          selectedMonth={calendar.selectedMonth}
          selectedYear={calendar.selectedYear}
          viewMonth={calendar.viewMonth}
          viewYear={calendar.viewYear}
          currentYear={calendar.currentYear}
          currentMonth={calendar.currentMonth}
          currentDay={calendar.currentDay}
          calendarDays={calendar.calendarDays}
          onClose={calendar.closeCalendar}
          onChangeMonth={(direction) => calendar.changeMonth(direction, period)}
          onConfirmDay={calendar.confirmDay}
          onConfirmMonth={calendar.confirmMonth}
          onConfirmYear={calendar.confirmYear}
          onConfirmHour={calendar.confirmHour}
        />
      )}
    </div>
  );
}
