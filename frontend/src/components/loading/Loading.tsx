import "./Loading.css";
import logo from "../../assets/logo-greener-n-text.svg";
import { useEffect, useState } from "react";

export default function Loading() {
  const texts = [
    "Garantindo que todas informações sejam carregadas..",
    "Refinando dados para você...",
    "Obrigada pela paciência!",
    "Qual serviço seu tem maior impacto?",
    "Já se perguntou quanto de CO2e foi emitido?",
  ];
  const [message, setMessage] = useState(texts[0]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      let value = Math.floor(Math.random() * texts.length);
      setMessage(texts[value]);
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="loading">
      <div className="loading-wrapper">
        <img src={logo} className="loading-logo" />
        <svg
          className="loading-circle"
          width="300"
          height="300"
          viewBox="-25 -25 250 250"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            r="100"
            cx="100"
            cy="100"
            fill="transparent"
            stroke="var(--complementary)"
            strokeWidth="14px"
          ></circle>
          <circle
            r="100"
            cx="100"
            cy="100"
            stroke="var(--primary)"
            strokeWidth="14px"
            strokeLinecap="round"
            strokeDashoffset="430px"
            fill="transparent"
            strokeDasharray="584px"
          ></circle>
        </svg>
      </div>
      <h2 className="loading-title">Estamos quase lá...</h2>
      <span className="loading-messages">{message}</span>
    </div>
  );
}
