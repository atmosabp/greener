import NotFoundHeader from "../../components/header/NotFoundHeader";
import "./NotFound.css";
import notFoundIcon from "../../assets/not-found-error.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [lastPage, setLastPage] = useState<string>("/");

  const [isUserLogged, _setIsUserLogged] = useState<boolean>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return false;
    return true;
  });

  const [isUserAdmin, _setIsUserAdmin] = useState<boolean>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return false;
    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.isAdm;
    } catch (e: any) {
      return false;
    }
  });

  useEffect(() => {
    if (isUserLogged) {
      if (isUserAdmin) {
        setLastPage(localStorage.getItem("last_page") || "/");
      } else {
        setLastPage(
          localStorage.getItem("last_page") == "/admin"
            ? "/home"
            : localStorage.getItem("last_page") || "/home",
        );
      }
    } else {
      setLastPage("/");
    }
  }, [isUserLogged, isUserAdmin]);

  return (
    <div className="not-found-page">
      <NotFoundHeader />
      <main className="not-found">
        <img src={notFoundIcon} width={50} />
        <h1>404</h1>
        <h3 className="main-text">
          Tentamos ver essa página mas ela se perdeu em meio a fumaça.
        </h3>
        <Link to={lastPage} className="back-button">
          Voltar
        </Link>
      </main>
    </div>
  );
}
