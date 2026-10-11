import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import './Dashboard.css'

export default function Dashboard() {
  return (
    <>
      <Header />
      <main>
        <h1> Tela Dashboard</h1>
        <Link to="/comparison">Comparação</Link>
        <Link to="/ranking">Ranking</Link>
      </main>
    </>
  );
}
