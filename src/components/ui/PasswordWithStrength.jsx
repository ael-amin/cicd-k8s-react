import React, { useState, useEffect } from 'react';

const PasswordWithStrength = ({
  value,
  confirmValue,
  onChange,
  onConfirmChange,
  error,
  confirmError
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [strength, setStrength] = useState('');
  const [criteria, setCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false
  });

  useEffect(() => {
    const validations = {
      length: value.length >= 8,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value)
    };
    setCriteria(validations);

    const score = Object.values(validations).filter(Boolean).length;
    if (value.length === 0) setStrength('');
    else if (score <= 1) setStrength('Trop court');
    else if (score === 2 || score === 3) setStrength('Moyen');
    else if (score === 4) setStrength('Fort');
  }, [value]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const allCriteriaMet = Object.values(criteria).every(Boolean);



  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
    <div className="relative">
  <input
    type={showPassword ? 'text' : 'password'}
    value={value}
    onChange={onChange}
    onFocus={() => setShowSuggestions(true)}
    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
    className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
    placeholder="••••••••"
  />
  <button
    type="button"
    onClick={() => setShowPassword(prev => !prev)}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M13.875 18.825a10.05 10.05 0 0 1-1.875.175c-4.418 0-8.204-2.978-10-7 1.056-2.395 2.882-4.374 5.125-5.624M9.88 9.88a3 3 0 0 0 4.24 4.24" />
        <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 4.5C7.305 4.5 3.27 7.61 2 12c1.27 4.39 5.305 7.5 10 7.5s8.73-3.11 10-7.5C20.73 7.61 16.695 4.5 12 4.5z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </button>
</div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>


      {showSuggestions && !allCriteriaMet && (
        <div className="shadow-lg rounded-lg bg-white p-4 border border-gray-200 space-y-2 mt-2">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className={`h-2 rounded ${strength === 'Fort' ? 'bg-green-500 w-full'
                : strength === 'Moyen' ? 'bg-yellow-500 w-2/3'
                : strength === 'Trop court' ? 'bg-red-500 w-1/3'
                : ''
              }`}
            />
          </div>
          <p className="text-sm text-gray-600">Force: <span className="font-semibold">{strength}</span></p>
          <ul className="text-sm space-y-1 leading-5">
            <li className={`${criteria.length ? 'text-green-600' : 'text-gray-600'} flex items-center gap-2`}>
              <span className="w-2 h-2 rounded-full bg-current" /> 8+ caractères
            </li>
            <li className={`${criteria.lowercase ? 'text-green-600' : 'text-gray-600'} flex items-center gap-2`}>
              <span className="w-2 h-2 rounded-full bg-current" /> Une minuscule
            </li>
            <li className={`${criteria.uppercase ? 'text-green-600' : 'text-gray-600'} flex items-center gap-2`}>
              <span className="w-2 h-2 rounded-full bg-current" /> Une majuscule
            </li>
            <li className={`${criteria.number ? 'text-green-600' : 'text-gray-600'} flex items-center gap-2`}>
              <span className="w-2 h-2 rounded-full bg-current" /> Un chiffre
            </li>
          </ul>
        </div>
      )}



      <div>
        <label className="block text-sm font-medium text-gray-700">Confirmer mot de passe</label>
        <div className="relative">
  <input
    type={showConfirmPassword ? 'text' : 'password'}
    value={confirmValue}
    onChange={onConfirmChange}
    className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
    placeholder="••••••••"
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(prev => !prev)}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showConfirmPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M13.875 18.825a10.05 10.05 0 0 1-1.875.175c-4.418 0-8.204-2.978-10-7 1.056-2.395 2.882-4.374 5.125-5.624M9.88 9.88a3 3 0 0 0 4.24 4.24" />
        <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 4.5C7.305 4.5 3.27 7.61 2 12c1.27 4.39 5.305 7.5 10 7.5s8.73-3.11 10-7.5C20.73 7.61 16.695 4.5 12 4.5z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </button>
  {confirmError && <p className="text-sm text-red-600 mt-1">{confirmError}</p>}
</div>
        {confirmError && <p className="text-sm text-red-600 mt-1">{confirmError}</p>}
      </div>
    </div>
    
  );
};

export default PasswordWithStrength;
