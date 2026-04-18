const ResultStatus = ({ probability }) => {
  const status = probability >= 70 ? 'High' : probability >= 40 ? 'Medium' : 'Low';
  const color = probability >= 70 ? 'green' : probability >= 40 ? 'orange' : 'red';
  return (
    <div className={`status-badge status-${color}`}>
      {status}
    </div>
  );
};

export default ResultStatus;

