import React from 'react';

const LanguageSelector = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="absolute top-4 right-4">
      <select
        value={currentLang}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-[#012D5A] focus:border-[#012D5A] p-2.5"
      >
        <option value="en">EN</option>
        <option value="fr">FR</option>
      </select>
    </div>
  );
};

export default LanguageSelector;