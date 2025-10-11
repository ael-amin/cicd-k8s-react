import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

const MailSent = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
        <div className="flex justify-center mb-4">
          <MailCheck className="h-16 w-16 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Vérification envoyée</h2>
        <p className="text-gray-600 mb-4">
          Un lien de vérification a été envoyé à votre adresse email. Veuillez consulter votre boîte de réception et cliquer sur le lien pour activer votre compte.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Si vous ne voyez pas l'email, vérifiez le dossier spam ou promotions.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2 bg-[#012D5A] text-white rounded-lg hover:bg-[#023e7d] transition-colors text-sm"
        >
          Revenir à la connexion
        </Link>
      </div>
    </div>
  );
};

export default MailSent;
