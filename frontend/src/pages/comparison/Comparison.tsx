import { Link } from "react-router-dom";
import AppHeader from "../../components/header/AppHeader";

export default function Comparison() {
  return (
    <>
      < AppHeader />
      <main>
        <h1>Comparação</h1>
        <Link to="/dashboard"> Voltar</Link>
      </main>
    </>
  );
}
