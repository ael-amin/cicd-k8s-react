import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CustomPhoneInput = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
  placeholder = "Entrez votre numéro",
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <PhoneInput
        country={'ma'}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        enableSearch={false} // ✅ hide search & icon 🔍
        countryCodeEditable={false}
        inputProps={{
          name: 'phone',
          required: true,
          autoFocus: false
        }}
        containerStyle={{
          width: '100%'
        }}
        inputStyle={{
          width: '100%',
          height: '44px',
          fontSize: '14px',
          paddingLeft: '64px',
          border: error ? '1px solid #dc2626' : '1px solid #d1d5db',
          borderRadius: '0.5rem',
          backgroundColor: disabled ? '#f9fafb' : '#ffffff',
          color: '#111827',
          outline: 'none',
          transition: 'border 0.2s ease-in-out'
        }}
        buttonStyle={{
          border: error ? '1px solid #dc2626' : '1px solid #d1d5db',
          borderRight: 'none',
          borderRadius: '0.5rem 0 0 0.5rem',
          backgroundColor: disabled ? '#f9fafb' : '#ffffff',
          padding: '0 12px'
        }}
        dropdownStyle={{
          borderRadius: '0.5rem',
          border: '1px solid #d1d5db',
          zIndex: 50
        }}
        {...props}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CustomPhoneInput;
