import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { updateUser } from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, profileData);
      setMessage('Perfil actualizado exitosamente');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al actualizar perfil');
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="column is-half is-offset-one-quarter">
          <h1 className="title has-text-centered">Editar Perfil</h1>
          {message && <p className={`notification ${message.includes('Error') ? 'is-danger' : 'is-success'}`}>{message}</p>}
          <form className="box" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Nombre</label>
              <input
                className="input"
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Nueva Contraseña (opcional)</label>
              <input
                className="input"
                type="password"
                name="password"
                value={profileData.password}
                onChange={handleChange}
                placeholder="Dejar en blanco si no desea cambiar"
              />
            </div>
            <button type="submit" className="button is-primary is-fullwidth">
              Actualizar Perfil
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export { Profile };