import { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage";
import HomePage from "./components/HomePage";
import "./App.css";

export const LanguageContext = createContext();

const App = () => {
  const [language, setLanguage] = useState("pl");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Router>
        <Routes>
          <Route path={process.env.PUBLIC_URL} element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </LanguageContext.Provider>
  );
};

export default App;
