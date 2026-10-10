import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <main>
      <h1>Homepage</h1>
      <Link to="/dashboard">Dashboard</Link>
    </main>
  );
}
