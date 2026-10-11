import { Link } from "react-router-dom";
import Header from "../../components/header/Header";

export default function Ranking() {
  return (
    <>
      <Header />
      <main>
        <h1>Tela de Ranking</h1>
        <Link to="/dashboard">Voltar</Link>
      </main>
    </>
  );
}
