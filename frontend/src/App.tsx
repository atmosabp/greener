import LandingHeader from "./components/header/landingHeader";
import Footer from "./components/footer/Footer";
import "./App.css";

export default function App() {
  return (
    <>
      <LandingHeader />
      <main>
        <div className="banner">
          <div className="banner-content">
            <div className="text">
              <h1>GREENER</h1>
              <h2>Do consumo computacional ao impacto ambiental.</h2>
              <p>
                Uma plataforma para transformar métricas de infraestrutura em
                indicadores de energia, água e emissões de CO2e.
              </p>
              <a href="">Saiba mais</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
