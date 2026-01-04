import { useState, useContext } from "react";
import PasswordForm from "./PasswordForm";
import { LanguageContext } from "../App";
import translations from "../translations";

const HomePage = () => {
  const { language } = useContext(LanguageContext);
  const [expanded, setExpanded] = useState(false);

  const toggleInstructions = () => {
    setExpanded(!expanded);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const text = translations[language].homePage;

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
          &nbsp; {text.title}
        </h1>
        <p>{text.description}</p>
        <br />
        <button onClick={toggleInstructions}>
          {expanded ? text.hideInstructions : text.showInstructions}
        </button>
        {expanded && (
          <ol>
            {text.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        )}
      </div>

      <PasswordForm />

      <div className="home-page__footer">
        <p>
          <a
            href={`https://github.com/pingwin02/literalnie-solver`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pingwiniasty
          </a>
          <br />
          &copy; 2026
        </p>
        <div className="mobileButton">
          <button onClick={handleScrollTop}>{text.scrollTop}</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
