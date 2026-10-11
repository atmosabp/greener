import { Link } from "react-router-dom";
import Header from "../../components/header/Header";

export default function Homepage() {
  return (
    <>
      <Header />
      <main>
        <h1>Homepage/Tela Principal</h1>
        <Link to="/dashboard">Dashboard</Link>
      </main>
    </>
  );
}
