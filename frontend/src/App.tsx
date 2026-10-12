import { Link } from "react-router-dom";
import LandingHeader from "./components/header/landingHeader";

export default function App() {
  return (
    <>
      <LandingHeader />
      <main>
        <h1>Landing Page</h1>
        <Link to="/login"> Ir para o login</Link>
      </main>
    </>
  );
}
