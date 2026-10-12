import { Link } from "react-router-dom";
import Header from "../../components/header/Header";

export default function Comparison() {
  return (
    <>
      <Header />
      <main>
        <h1>Comparação</h1>
        <Link to="/dashboard"> Voltar</Link>
      </main>
    </>
  );
}
