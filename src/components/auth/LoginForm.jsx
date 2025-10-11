import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email est requis';
    } else if (!/\S+@um6p\.ma$/.test(email)) {
      newErrors.email = 'Email doit être @um6p.ma';
    }

    if (!password) {
      newErrors.password = 'Mot de passe est requis';
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      toast.error('Email ou mot de passe invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = async () => {
    setLoading(true);
    try {
      // Simulate SSO process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock SSO login - determine role based on email
      const mockEmail = 'admin@um6p.ma'; // Could be randomized
      const userData = {
        email: mockEmail,
        role: mockEmail.includes('admin') ? 'admin' : 'user',
        token: 'mock-sso-token'
      };
      
      // Use the existing login context
      await login(mockEmail, 'sso-password');
      toast.success(`Connecté via SSO en tant que ${userData.role}`);
    } catch (error) {
      toast.error('Erreur lors de la connexion SSO');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!forgotEmail) {
      setForgotEmailError('Email est requis');
      return;
    }
    
    if (!/\S+@um6p\.ma$/.test(forgotEmail)) {
      setForgotEmailError('Email doit être @um6p.ma');
      return;
    }

    // Simulate sending reset email
    toast.success(`Un email de réinitialisation a été envoyé à ${forgotEmail}`);
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotEmailError('');
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotEmailError('');
  };

  return (
    <>
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Connexion</h2>
          <p className="mt-2 text-gray-600">Accédez au portail d'achat UM6P</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              label="Adresse Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@um6p.ma"
              disabled={loading}
            />
            <Input
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Votre mot de passe"
              disabled={loading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-[#012D5A]"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#012D5A] border-gray-300 rounded"
                />
                <span className="ml-2">Se souvenir de moi</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-[#012D5A] hover:text-[#023e7d] transition-colors"
              >
                Mot de passe oublié?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className={loading ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          <Button 
            type="button"
            variant="outline" 
            fullWidth 
            disabled={loading}
            onClick={handleSSO}
            className="flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Connexion SSO...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Connexion avec UM6P SSO</span>
              </>
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte?{' '}
            <Link to="/signup" className="font-medium text-[#012D5A] hover:text-[#023e7d]">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotPassword}
        onClose={closeForgotPasswordModal}
        title="Réinitialiser le mot de passe"
        size="sm"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Entrez votre adresse email UM6P pour recevoir un lien de réinitialisation.
          </div>
          
          <Input
            label="Adresse Email UM6P"
            type="email"
            id="forgotEmail"
            value={forgotEmail}
            onChange={(e) => {
              setForgotEmail(e.target.value);
              setForgotEmailError('');
            }}
            error={forgotEmailError}
            placeholder="you@um6p.ma"
            autoFocus
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
            >
              Envoyer le lien
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeForgotPasswordModal}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default LoginForm;