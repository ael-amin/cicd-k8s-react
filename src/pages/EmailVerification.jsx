import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Simulate verification request
        await new Promise(resolve => setTimeout(resolve, 2000));

        // If token is valid:
        if (token === 'valid-token-demo') {
          setStatus('success');
          toast.success('Votre email a été vérifié avec succès!');
        } else {
          throw new Error('Token invalide');
        }
      } catch (err) {
        setStatus('error');
        toast.error('Échec de la vérification de l\'email');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center space-y-4">
        {status === 'verifying' && (
          <>
            <p className="text-lg font-medium text-gray-600">Vérification de votre email...</p>
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto"></div>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto" />
            <h2 className="text-xl font-semibold text-green-600">Email vérifié!</h2>
            <p className="text-gray-500">Vous pouvez maintenant vous connecter à votre compte.</p>
            <Button onClick={() => navigate('/login')} fullWidth>Se connecter</Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="text-red-500 w-12 h-12 mx-auto" />
            <h2 className="text-xl font-semibold text-red-600">Échec de la vérification</h2>
            <p className="text-gray-500">Le lien de vérification est invalide ou expiré.</p>
            <Button onClick={() => navigate('/signup')} fullWidth>Retour à l'inscription</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
