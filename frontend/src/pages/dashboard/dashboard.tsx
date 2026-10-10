import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Link to="/comparison">Comparação</Link>
      <Link to="/ranking">Ranking</Link>
    </main>
  );
}
