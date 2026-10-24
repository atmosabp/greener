
import AppHeader from "../../components/header/AppHeader";
import type { Service, ServiceStatus } from "../../pages/home/Homepage";
import "./Comparison.css";

const mockServices: Service[] = [
  {
    id: "1",
    name: "Billing API",
    status: "inactive",
    latitude: -23.5505,
    longitude: -46.6333,
    co2e: 120,
  },
  {
    id: "2",
    name: "Checkout Worker",
    status: "incomplete",
    latitude: 39.0438,
    longitude: -77.4874,
    co2e: 120,
  },
  {
    id: "3",
    name: "Inventory Sync",
    status: "active",
    latitude: 43.6532,
    longitude: -79.3832,
    co2e: 120,
  },
  {
    id: "4",
    name: "Audit Stream",
    status: "active",
    latitude: 35.6762,
    longitude: 139.6503,
    co2e: 120,
  },
  {
    id: "5",
    name: "Email Dispatcher",
    status: "inactive",
    latitude: -23.5505,
    longitude: -46.6333,
    co2e: 120,
  },
  {
    id: "6",
    name: "Fraud Detector",
    status: "incomplete",
    latitude: 39.0438,
    longitude: -77.4874,
    co2e: 120,
  },
  {
    id: "7",
    name: "Reporting Batch",
    status: "active",
    latitude: 43.6532,
    longitude: -79.3832,
    co2e: 120,
  },
];

export default function Comparison() {
    return (
        <div className="comparison-page">
            <AppHeader />

            <main className="comparison-main">
                <section className="comparison-heading">
                    <div>
                        <h1>Bom dia, Júlia.</h1>
                        <p>Comparação de serviços</p>
                    </div>

                    <select
                        className="comparison-period"
                        aria-label="Período de análise"
                        defaultValue="today"
                    >
                        <option value="today">Hoje</option>
                        <option value="7days">Ultimos 7 dias</option>
                        <option value="1month">Mês passado</option>
                    </select>
                  <section className="comparison-select-services">
                      <option value="{services.id}"></option>
                  </section>
                </section>


                <footer className="comparison-footer">
                    Desenvolvido por Atmos © 2026
                </footer>
            </main>
        </div>
    );
}
