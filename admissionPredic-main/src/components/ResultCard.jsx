const ResultCard = ({ probability, statusLabel, message, strengths, weaknesses, children }) => {
  return (
    <div className="result-card">
      <h3>Prediction Result</h3>
      {typeof probability === 'number' && (
        <p className="result-probability">{probability}%</p>
      )}
      {statusLabel && <p className="result-status-label">Status: {statusLabel}</p>}
      {message && <p className="result-message">{message}</p>}
      {(strengths || weaknesses) && (
        <div className="result-sw">
          {strengths ? (
            <p className="result-sw-block">
              <strong>Strengths</strong>
              <span>{strengths}</span>
            </p>
          ) : null}
          {weaknesses ? (
            <p className="result-sw-block">
              <strong>Weaknesses</strong>
              <span>{weaknesses}</span>
            </p>
          ) : null}
        </div>
      )}
      {children}
    </div>
  );
};

export default ResultCard;

