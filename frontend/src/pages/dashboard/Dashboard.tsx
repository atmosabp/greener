import { Link } from "react-router-dom";
import AppHeader from "../../components/header/AppHeader";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <>
      <AppHeader />
      <main className="dashboard">
        <div className="start-section">
          <div className="text">
            <h1>Bom dia, &lt;nome do usu&aacute;rio&gt;.</h1>
            {/* Será substituído pelo nome do usuário */}
            <p>
              Analise os dados do serviço &lt;nome do servi&ccedil;o&gt;.
              {/* Será substituído pelo nome do serviço */}
            </p>
          </div>
          <div className="btns">
            <span>última atualização: 00:30</span>
            {/* Será substituído pela última atualização */}
            <div className="btn-update">
              <span>Atualizações:</span>
              <select name="updates" id="update-select">
                <option value="5">05s</option>
                <option value="10">10s</option>
                <option value="15">15s</option>
                <option value="30">30s</option>
                <option value="60">60s</option>
                <option value="120">120s</option>
              </select>
            </div>
            <div className="btn-date">
              <select name="updates" id="update-select">
                <option value="today">Hoje</option>
                <option value="#">Escolher data</option>
              </select>
            </div>
          </div>
        </div>
        <div className="main-section">
          <div className="parent">
            <div className="div1 service-info">
              <h4>Serviço selecionado</h4>
              <p>Nome do serviço</p>
            </div>
            <div className="div2 service-info">
              <h4>Status</h4>
              <div className="service-info-status">
                <div className="status"></div>{" "}
                {/* backend: tem que mudar a cor aqui */}
                <p>Status do serviço</p>
              </div>
            </div>
            <div className="div3 service-info">
              <h4>Localização</h4>
              <p>localização do serviços</p>
            </div>
            <div className="div4">
              <p>Outros serviços</p>
              </div>
            <div className="div5 service-data">
              <p>Consumo energético</p>
              <h4>12,48 kWh</h4>
            </div>
            <div className="div6 metrics">
              <p>CPU</p>
              <h4>38%</h4> {/* backend: tem que mudar dado aqui */}
            </div>
            <div className="div7 metrics">
              <p>Armazenamento</p>
              <h4>8GB</h4> {/* backend: tem que mudar dado aqui */}
            </div>
            <div className="div8 service-data">
              <p>Emissão de CO2e</p>
              <h4>4,21 Kg CO2e</h4>
            </div>
            <div className="div9 metrics">
              <p>Memória</p>
              <h4>1.36GB</h4> {/* backend: tem que mudar dado aqui */}
            </div>
            <div className="div10 metrics">
              <p>Rede</p>
              <h4>0,21GB</h4> {/* backend: tem que mudar dado aqui */}
            </div>
            <div className="div11 analyctic-data">Energia Renovável</div>
            <div className="div12 analyctic-data">Intensidade de Carbono</div>
          </div>
        </div>
      </main>
    </>
  );
}
