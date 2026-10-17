import { Link } from "react-router-dom";
import AppHeader from "../../components/header/appHeader";

export default function Homepage() {
  return (
    <>
      <AppHeader />
      <main>
        <h1>Homepage/Tela Principal</h1>
        <Link to="/dashboard">Dashboard</Link>
      </main>
    </>
  );
}
