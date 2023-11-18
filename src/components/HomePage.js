import React, { useState } from "react";
import PasswordForm from "./PasswordForm";

const HomePage = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleInstructions = () => {
    setExpanded(!expanded);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <div className="home-page__content">
        <h1>
          <img
            src={process.env.PUBLIC_URL + "/literalnie.png"}
            alt="logo"
            height="30"
            width="30"
          />
          &nbsp; Literalnie Solver
        </h1>
        <p>
          Aplikacja do rozwiązywania zagadek z gry{" "}
          <a href="https://literalnie.fun/" target="_blank" rel="noreferrer">
            Literalnie
          </a>
          .
        </p>
        <br />
        <button onClick={toggleInstructions}>
          {expanded ? "Schowaj instrukcję" : "Pokaż instrukcję"}
        </button>
        {expanded && (
          <ol>
            <li>
              Wpisz hasło, które chcesz rozwiązać, w polu <em>Podaj hasło</em>.
              Jeśli nie znasz litery zostaw pole puste. Możesz również wybrać
              tryb słownikowy, wtedy długość hasła nie ma znaczenia. Przykład:{" "}
              <strong>???os</strong>
            </li>
            <li>
              Wpisz litery, które chcesz zbanować, w polu{" "}
              <em>Podaj litery do zbanowania</em>. Jeśli nie chcesz zbanować
              żadnej litery, pozostaw to pole puste. Przykład:{" "}
              <strong>o</strong>
            </li>
            <li>
              Wpisz litery, które muszą się znaleźć w haśle, w polu{" "}
              <em>Podaj litery, które muszą się znaleźć w haśle</em>. Jeśli nie
              musi się znaleźć żadna litera, pozostaw to pole puste. Przykład:{" "}
              <strong>s</strong>
            </li>
            <li>
              Kliknij przycisk <em>Szukaj</em>.
            </li>
          </ol>
        )}
      </div>

      <PasswordForm />

      <div className="home-page__footer">
        <p>
          <a
            href="https://pingwiniasty.ct8.pl/"
            target="_blank"
            rel="noreferrer"
          >
            Pingwiniasty
          </a>
          <br />
          &copy; 2023
        </p>
        <br />
        <button onClick={handleScrollTop}>Do góry</button>
      </div>
    </div>
  );
};

export default HomePage;
