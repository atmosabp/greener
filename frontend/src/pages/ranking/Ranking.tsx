import { Link } from "react-router-dom";
import AppHeader from "../../components/header/appHeader";

export default function Ranking() {
  return (
    <>
      <AppHeader />
      <main>
        <h1>Tela de Ranking</h1>
        <Link to="/dashboard">Voltar</Link>
      </main>
    </>
  );
}
