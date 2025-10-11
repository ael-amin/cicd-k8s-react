import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import PhoneInput from '../components/ui/PhoneInput';
import BrandingSection from '../components/auth/BrandingSection';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import PasswordWithStrength from "../components/ui/PasswordWithStrength";


const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [phoneValid, setPhoneValid] = useState(null);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));

    setPhoneValid(null);
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Numéro de téléphone est requis';

    const normalized = phone.startsWith('+') ? phone : `+${phone}`;
    const isValid = isValidPhoneNumber(normalized);

    if (!isValid) return 'Numéro de téléphone invalide';

    return null;
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData.email) {
      newErrors.email = 'Email est requis';
    } else if (!formData.email.endsWith('@um6p.ma')) {
      newErrors.email = 'Veuillez utiliser votre adresse email UM6P (@um6p.ma)';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation du mot de passe requise';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneBlur = () => {
    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) {
        setErrors(prev => ({
          ...prev,
          phone: phoneError
        }));
        setPhoneValid(false);
      } else {
        setPhoneValid(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const normalized = formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`;
      const parsed = parsePhoneNumber(normalized);
      const formattedPhone = parsed?.number || normalized;

      const accountData = {
        ...formData,
        phone: formattedPhone
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Created:', accountData);
      toast.success('Compte créé avec succès!');
      navigate('/mail-sent');

      setFormData({
        fullName: '',
        email: '',
        password: '',
        phone: ''
      });
      setPhoneValid(null);
    } catch (err) {
      toast.error('Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <BrandingSection />
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Inscription</h2>
            <p className="mt-2 text-gray-600">Créez votre compte UM6P</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <Input
              label="Nom Complet"
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Ex: Ali EL Amine"
              disabled={loading}
            />

            <Input
              label="Adresse Email UM6P"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="prenom.nom@um6p.ma"
              disabled={loading}
            />

            {/* <Input
              label="Mot de passe"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Minimum 8 caractères"
              disabled={loading}
            /> */}
            <PasswordWithStrength
              value={formData.password}
              confirmValue={formData.confirmPassword}
              onChange={(e) =>
                handleChange({ target: { id: "password", value: e.target.value } })
              }
              onConfirmChange={(e) =>
                handleChange({ target: { id: "confirmPassword", value: e.target.value } })
              }
              error={errors.password}
              confirmError={errors.confirmPassword}
            />

            <div className="relative">
              <PhoneInput
                label="Numéro de téléphone"
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                error={errors.phone}
                disabled={loading}
                placeholder="Entrez votre numéro"
              />

              {phoneValid !== null && formData.phone && (
                <div className="absolute right-3 top-9 flex items-center">
                  {phoneValid ? (
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={loading || (formData.phone && phoneValid === false)}
              className={loading ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {loading ? 'Création du compte...' : "S'inscrire"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="font-medium text-[#012D5A] hover:text-[#023e7d]">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
