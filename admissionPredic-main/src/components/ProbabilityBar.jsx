const ProbabilityBar = ({ probability }) => {
  const percent = probability || 0;
  const color = percent > 70 ? '#4ade80' : percent > 40 ? '#facc15' : '#ef4444';
  return (
    <div className="probability-bar">
      <div className="bar-label">
        <span>Admission Chance</span>
        <span>{percent}%</span>
      </div>
      <div className="bar-container">
        <div 
          className="bar-fill" 
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ProbabilityBar;

