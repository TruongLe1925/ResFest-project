const Select = ({ value, onChange, options = [], required = false, ...props }) => {
  return (
    <select 
      value={value || ''} 
      onChange={onChange} 
      required={required}
      {...props}
    >
      <option value="">
        {required ? '-- Select an option --' : 'Select...'}
      </option>
      {options && options.length > 0 ? (
        options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))
      ) : (
        <option value="" disabled>
          No options available
        </option>
      )}
    </select>
  );
};

export default Select;

