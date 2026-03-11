import "../styles/PasswordResults.css";

const getDikiUrl = (password) =>
  `https://www.diki.pl/slownik-angielskiego?q=${encodeURIComponent(password)}`;

function PasswordLink({ password }) {
  return (
    <span
      className="password-link"
      onClick={() =>
        window.open(getDikiUrl(password), "_blank", "noopener,noreferrer")
      }
    >
      {password}
    </span>
  );
}

function PasswordResults({
  dictionaryMode,
  isLoading,
  hasAnyConflict,
  text,
  possiblePasswords,
  currentPasswords,
  totalPages,
  currentPage,
  onChangePage
}) {
  if (isLoading) {
    return <div className="loading-animation">{text.loading}</div>;
  }

  if (!dictionaryMode && hasAnyConflict) {
    return (
      <div className="conflict-message">
        <h3>{text.conflictDetected}</h3>
      </div>
    );
  }

  if (possiblePasswords.length === 1) {
    const password = possiblePasswords[0];
    return (
      <div className="single-result">
        <h3>
          {text.foundOnePasswordLabel} <PasswordLink password={password} />
        </h3>
      </div>
    );
  }

  if (currentPasswords.length === 0) {
    return <h3>{text.noPasswords}</h3>;
  }

  return (
    <div>
      <h3>{text.foundPasswords(possiblePasswords.length)}</h3>
      <ul>
        {currentPasswords.map((password, index) => (
          <li key={index} className="password">
            <PasswordLink password={password} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="pagination">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(event) => {
              const value = Number.parseInt(event.target.value, 10);
              if (value >= 1 && value <= totalPages) {
                onChangePage(value);
              } else if (value > totalPages) {
                onChangePage(totalPages);
              } else {
                onChangePage(1);
              }
            }}
          />
          <br />
          <button onClick={() => onChangePage(1)} disabled={currentPage === 1}>
            |&lt;
          </button>
          <button
            onClick={() => onChangePage(currentPage - 10)}
            disabled={currentPage <= 10}
          >
            &lt;&lt;
          </button>
          <button
            onClick={() => onChangePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <button
            onClick={() => onChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
          <button
            onClick={() => onChangePage(currentPage + 10)}
            disabled={currentPage >= totalPages - 10}
          >
            &gt;&gt;
          </button>
          <button
            onClick={() => onChangePage(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;|
          </button>
          <br />
          <button
            onClick={() => onChangePage(Math.ceil(totalPages / 4))}
            disabled={currentPage === Math.ceil(totalPages / 4)}
          >
            &#188;
          </button>
          <button
            onClick={() => onChangePage(Math.ceil(totalPages / 2))}
            disabled={currentPage === Math.ceil(totalPages / 2)}
          >
            &#189;
          </button>
          <button
            onClick={() => onChangePage(Math.ceil((3 * totalPages) / 4))}
            disabled={currentPage === Math.ceil((3 * totalPages) / 4)}
          >
            &#190;
          </button>
          <br />
          <p>{text.page(currentPage, totalPages)}</p>
        </div>
      )}
    </div>
  );
}

export default PasswordResults;
