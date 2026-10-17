import LandingHeader from "./components/header/landingHeader";
import Footer from "./components/footer/Footer";
import Logo from "./assets/logo-greener-n-text.svg";
import aboutPic from "./assets/about-picture.png";
import PlantPic from "./assets/plant.png";
import {
  ShieldCheck,
  Globe,
  Map,
  LayoutDashboard,
  Trophy,
  ArrowLeftRight,
  UserCog,
  Mail,
} from "lucide-react";
import "./App.css";
import { useEffect, useState } from "react";

// Cards de passos da missão (teste para ver se isso torna o código mais organizado/fácil de manter)
const steps = [
  { title: "Coletar", text: "CPU, RAM, disco e rede" },
  { title: "Estimar", text: "Potência e energia" },
  { title: "Contextualizar", text: "Intensidade regional" },
  { title: "Decidir", text: "Comparar e otimizar" },
];

// Cards de feature (teste para ver se isso torna o código mais organizado/fácil de manter)
const features = [
  {
    title: "Globo",
    Icon: Globe,
    text: "Visualização global da localização dos serviços disponíveis.",
  },
  {
    title: "Mapa",
    Icon: Map,
    text: "Visualização geográfica dos serviços, com detalhes de latitude e longitude.",
  },
  {
    title: "Dashboard",
    Icon: LayoutDashboard,
    text: "Acompanhamento dinâmico de métricas, com atualização automática e visualização clara dos dados.",
  },
  {
    title: "Ranking",
    Icon: Trophy,
    text: "Classificação dos serviços conforme suas métricas e seus impactos ambientais.",
  },
  {
    title: "Comparação",
    Icon: ArrowLeftRight,
    text: "Comparação de métricas entre dois ou mais serviços para facilitar a análise de seus impactos ambientais.",
  },
  {
    title: "Admin",
    Icon: UserCog,
    text: "Gerenciamento de usuários, com controle de acesso, adição e remoção de contas.",
  },
];

// Cards de indicadores (teste para ver se isso torna o código mais organizado/fácil de manter)
const indicators = [
  { n: "01", text: "Qual aplicação tem maior impacto?", tone: "light" },
  { n: "02", text: "Qual serviço é mais eficiente?", tone: "medium" },
  { n: "03", text: "Quanto CO2e cada aplicação emitiu?", tone: "primary" },
  {
    n: "04",
    text: "Onde a matriz elétrica é mais limpa?",
    tone: "primary-medium",
  },
  { n: "05", text: "Migrar de região reduziria emissões?", tone: "dark" },
  {
    n: "Objetivo",
    text: "Comparar serviços, regiões e tendências.",
    tone: "darker",
  },
];

export default function App() {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {isMobile ? <img src={Logo} className="logo-top"/> : ""}
      <LandingHeader />

      <main className="landingpage">
        {/* seção BANNER */}
        <section className="section-spaced">
          <div className="banner">
            <div className="text">
              <h1>GREENER</h1>
              <h2>Do consumo computacional ao impacto ambiental.</h2>
              <p>
                Uma plataforma para transformar métricas de infraestrutura em
                indicadores de energia, água e emissões de CO2e.
              </p>
              <a href="#about" className="banner-btn">
                Saber mais
              </a>
            </div>
          </div>
        </section>

        {/* seção SOBRE */}
        <section className="about" id="about">
          <div className="about-content">
            <div className="about-texts">
              <span className="section-id">O QUE É</span>
              <h2>Monitoramento com propósito.</h2>
              <p>
                <b>GreenER</b> é uma plataforma web capaz de monitorar{" "}
                <b>continuamente</b> serviços de software, estimar seu consumo
                energético e calcular sua emissão aproximada de CO₂ equivalente
                (CO₂e).
              </p>
              <p>
                A aplicação consiste em monitorar métricas de serviços e as
                exibir conforme a necessidade do usuário.
              </p>
            </div>
            <img
              src={aboutPic}
              className="about-img"
              alt="Dashboard do GreenER em um notebook"
            />
          </div>
          <div className="info-toast">
            <ShieldCheck size={32} />
            <span>
              Desenvolvida para <b>funcionários credenciados</b> terem controle
              do consumo de diversos serviços de sua própria empresa.
            </span>
          </div>
        </section>

        {/* seção MISSÃO */}
        <section className="mission" id="mission">
          <span className="section-id">MISSÃO</span>
          <h2>
            Transformar sinais técnicos em uma {isMobile ? <br /> : ""}
            <mark>métrica ambiental.</mark>
          </h2>
          <div className="cards-mission">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`mission-step ${i % 2 === 0 ? "left" : "right"}`}
              >
                <div className="card" style={{ gridRow: i + 1 }}>
                  <h4>{s.title}</h4>
                  <p>{s.text}</p>
                </div>
                <div className="number" style={{ gridRow: i + 1 }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* seção FUNCIONALIDADES */}
        <section className="functions" id="functions">
          <span className="section-id">FUNCIONALIDADES</span>
          <h2>Mais clareza, melhores decisões.</h2>
          <p>
            Conheça as funcionalidades e acompanhe o consumo de recursos e os
            impactos ambientais dos seus serviços <b>em um só lugar.</b>
          </p>
          <div className="functions-grid">
            {features.map(({ title, Icon, text }, i) => (
              <div
                key={title}
                className={`function-card ${i % 2 === 0 ? "ltr" : "rtl"}`}
              >
                <div className="function-text">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <Icon size={64} strokeWidth={1.6} />
                {i === 0 && (
                  <ArrowLeftRight className="function-link" size={22} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* seção RESULTADO */}
        <section className="results" id="results">
          <span className="section-id">RESULTADO</span>
          <h2>
            Indicadores que orientam <em>decisões reais</em>
          </h2>
          <p>
            Medir emissões só faz sentido quando leva a uma <b>escolha</b>. Por
            isso, cada indicador do projeto responde a uma pergunta prática.
          </p>
          <div className="indicators">
            {indicators.map((item) => (
              <div key={item.n} className={`indicator ${item.tone}`}>
                <strong>{item.n}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="success" id="success">
          <div className="success-text">
            <span className="section-id">CRITÉRIO DE SUCESSO</span>
            <h2>
              Um <em>sistema </em> vivo <br />
              para um ambiente <em>vivo.</em>
            </h2>
            <h3>
              Monitorar <em>•</em> Calcular <em>•</em> Explicar
            </h3>
            <p>Faça login e aproveite todos recursos.</p>
            <a href="/login" className="btn-dark">
              Fazer login
            </a>
          </div>
          <img
            src={PlantPic}
            className="success-img"
            alt="Broto crescendo em solo fértil"
          />
        </section>

        {/* seção INTERESSE */}
        <section className="section-spaced">
          <div className="interest-info">
            <div className="interest-card">
              <div className="info">
                <div className="image">
                  <img src={Logo} alt="Logo GreenER" />
                </div>
                <div className="texts">
                  <h2>
                    Se <em>interessou </em>
                    <span>?</span>
                  </h2>
                  <p>
                    Se deseja ter acesso ao <b>GreenER</b> e monitorar o consumo
                    energético dos serviços da sua corporação
                  </p>
                  <p>
                    Peça cadastro a um funcionário com acesso administrativo de
                    sua empresa para fazer login.
                  </p>
                </div>
              </div>
              <div className="links">
                <div className="icons">
                  <a href="#" aria-label="LinkedIn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-linkedin"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-instagram"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                    </svg>
                  </a>
                  <a href="#" aria-label="E-mail">
                    <Mail size={28} />
                  </a>
                </div>
                <div className="login">
                  <p>
                    <b>Já possui cadastro na plataforma?</b>
                  </p>
                  <a href="/login">
                    Faça login <span>aqui</span>.
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
