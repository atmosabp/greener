import "./Loading.css";
import loadAnimation from "../../assets/atmos-loading-anim.gif";

export default function Loading() {
  return (
    <div className="loading">
      <img src={loadAnimation} alt="Carregando..." />

      <div className="loading-bar">
      </div>
    </div>
  );
}
