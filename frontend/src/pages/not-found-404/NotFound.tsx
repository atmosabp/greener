import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotFoundHeader from "../../components/header/NotFoundHeader";
import "./NotFound.css";

import { TriangleAlertIcon } from "lucide-react";

import cloudImage from "../../assets/cloud.png";

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
    document.body.style.overflow = "hidden";
        
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
    return () => {
      document.body.style.overflow = "visible";
    }
  }, [isUserLogged, isUserAdmin]);

  return (
    <div className="not-found-page">
      <NotFoundHeader />
      <main className="not-found">
        <TriangleAlertIcon className="alert-icon" />
        <h1>404</h1>
        <p className="main-text">
          Tentamos ver essa página mas ela se perdeu em meio a fumaça.
        </p>
        <Link to={lastPage} className="back-button">
          <span>Voltar</span>
        </Link>

        <div className="clouds-container">
          <div>
            <img className="cloud-small" src={cloudImage} width={50} />
            <img className="cloud-big" src={cloudImage} width={50} />
            <img className="cloud-medium" src={cloudImage} width={50} />
            <img className="cloud-medium" src={cloudImage} width={50} />
            <img className="cloud-small" src={cloudImage} width={50} />
            <img className="cloud-big" src={cloudImage} width={50} />
            <img className="cloud-medium" src={cloudImage} width={50} />
          </div>
        </div>
      </main>
    </div>
  );
}
