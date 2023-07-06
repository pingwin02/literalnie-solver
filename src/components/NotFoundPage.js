import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/react">Go back to the main page</Link>
    </div>
  );
};

export default NotFoundPage;
