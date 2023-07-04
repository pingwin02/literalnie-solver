import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PasswordForm from "./components/PasswordForm";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go back to the main page</Link>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div style={{ textAlign: "center", width: "50%", margin: "auto" }}>
        <h1>Literalnie Solver</h1>
        <p>
          Aplikacja do rozwiązywania zagadek z gry{" "}
          <a href="https://literalnie.fun/">Literalnie</a>.
        </p>
        Instrukcja użycia:
        <br />
        <ol style={{ textAlign: "left" }}>
          <li>
            Wpisz hasło, które chcesz rozwiązać, w polu{" "}
            <em>Podaj ciąg znaków</em>. Jeśli nie znasz litery wpisz <em>?</em>.
            Możesz wybrać również tryb słownikowy, wtedy długość hasła nie ma
            znaczenia. Przykład: <strong>???os</strong>
          </li>
          <li>
            Wpisz litery, które chcesz zbanować, w polu{" "}
            <em>Podaj litery do zbanowania</em>. Jeśli nie chcesz zbanować
            żadnej litery, pozostaw to pole puste. Przykład: <strong>o</strong>
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
      </div>

      <div>
        <Routes>
          <Route path="/react" element={<PasswordForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <div style={{ textAlign: "center", width: "50%", margin: "auto" }}>
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
      </div>
    </Router>
  );
};

export default App;
