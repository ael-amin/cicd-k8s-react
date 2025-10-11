import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import BrandingSection from '../components/auth/BrandingSection';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <BrandingSection />
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;