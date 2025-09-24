import React from 'react';

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  options = [], 
  icon = null, 
  className = '', 
  isMulti = false, 
  required = false
}) => {
  const inputId = name || label.toLowerCase().replace(/\s/g, '-');

  const renderField = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'url':
        return (
          <input
            type={type}
            id={inputId}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm ${className}`}
            required={required}
          />
        );
      case 'textarea':
        return (
          <textarea
            id={inputId}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows="4"
            className={`form-textarea block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm ${className}`}
            required={required}
          ></textarea>
        );
      case 'select':
        return (
          <select
            id={inputId}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm ${className}`}
            multiple={isMulti}
            required={required}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {renderField()}
        {icon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">{icon}</div>}
      </div>
    </div>
  );
};

export default FormField;