import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    photo: user.photo || '',
  });
  const [preview, setPreview] = useState(user.photo || '');

  useEffect(() => {
    if (form.photo) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(form.photo);
    }
  }, [form.photo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5*1024*1024) {
      toast.error('Max 5 MB');
      return;
    }
    setForm(prev => ({ ...prev, photo: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      toast.success('Profile mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Mon profil</h2>

      <div className="flex flex-col items-center mb-6">
        {preview
          ? <img src={preview} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
          : <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">?</div>}
        <label className="mt-2 text-blue-600 hover:underline cursor-pointer">
          Change photo
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nom complet</label>
          <input
            name="fullName" value={form.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email" value={form.email}
            readOnly
            className="w-full p-2 bg-gray-100 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default Profile;
