export function RadioGroup({ name, options, value, onChange, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export function YesNoRadio({ name, value, onChange }) {
  return (
    <RadioGroup
      name={name}
      options={[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]}
      value={value}
      onChange={onChange}
    />
  );
}

export function YesNoNARadio({ name, value, onChange }) {
  return (
    <RadioGroup
      name={name}
      options={[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'na', label: 'N/A' }
      ]}
      value={value}
      onChange={onChange}
    />
  );
}
