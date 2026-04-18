const Select = ({ value, onChange, options = [], ...props }) => {
  return (
    <select value={value} onChange={onChange} {...props}>
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;

