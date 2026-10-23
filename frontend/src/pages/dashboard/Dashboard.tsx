import { Link } from "react-router-dom";
import AppHeader from "../../components/header/AppHeader";
import './Dashboard.css'

export default function Dashboard() {
  return (
    <>
      <AppHeader />
      <main>
        <h1> Tela Dashboard</h1>
        <Link to="/comparison">Comparação</Link>
        <Link to="/ranking">Ranking</Link>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </main>
    </>
  );
}
