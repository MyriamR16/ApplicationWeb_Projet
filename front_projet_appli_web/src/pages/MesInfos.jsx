import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import './style/MesInfos.css';

function MesInfos() {
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`http://localhost:8081/api/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  function handleEdit(field, value) {
    setEditField(field);
    setEditValue(value);
    setMessage('');
  }

  function handleChange(e) {
    setEditValue(e.target.value);
  }

  function handleSave(field) {
    fetch(`http://localhost:8081/api/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...user, [field]: editValue })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la mise à jour');
        setUser({ ...user, [field]: editValue });
        setEditField(null);
        setMessage('Modification enregistrée !');
      })
      .catch(() => setMessage('Erreur lors de la mise à jour'));
  }

  function handleDelete() {
    if (!window.confirm("Supprimer définitivement votre compte ?")) return;
    fetch(`http://localhost:8081/api/user/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        localStorage.clear();
        window.location.href = '/connexion';
      });
  }

  if (!user) return <div className="mesinfos-bg d-flex align-items-center justify-content-center" style={{minHeight:'100vh'}}>Chargement...</div>;

  const fields = [
    { label: 'Nom', key: 'nom' },
    { label: 'Prénom', key: 'prenom' },
    { label: 'Email', key: 'email' },
    { label: 'Niveau', key: 'niveau' },
    { label: 'Pseudo', key: 'pseudo' },
   
  ];

  return (
    <>
      <Navigation />
      <div className="mesinfos-bg">
        <div className="mesinfos-container">
          <h2 className="mesinfos-title">Mes infos</h2>
          <table className="mesinfos-table">
            <tbody>
              {fields.map(({ label, key }) => (
                <tr key={key}>
                  <td className="label">{label}</td>
                  <td className="value">
                    {editField === key ? (
                      <input
                        type={key === 'email' ? 'email' : 'text'}
                        value={editValue}
                        onChange={handleChange}
                        className="mesinfos-input"
                      />
                    ) : (
                      user[key]
                    )}
                  </td>
                  <td className="action">
                    {editField === key ? (
                      <>
                        <button onClick={() => handleSave(key)} className="mesinfos-btn save">Enregistrer</button>
                        <button onClick={() => setEditField(null)} className="mesinfos-btn cancel">Annuler</button>
                      </>
                    ) : (
                      <button onClick={() => handleEdit(key, user[key])} className="mesinfos-btn edit">Modifier</button>
                    )}
                  </td>
                </tr>
              ))}
              {/* Mot de passe */}
              <tr>
                <td className="label">Mot de passe</td>
                <td className="value">
                  {editField === 'motDePasse' ? (
                    <input
                      type="password"
                      value={editValue}
                      onChange={handleChange}
                      className="mesinfos-input"
                      placeholder="Nouveau mot de passe"
                    />
                  ) : (
                    '********'
                  )}
                </td>
                <td className="action">
                  {editField === 'motDePasse' ? (
                    <>
                      <button onClick={() => handleSave('motDePasse')} className="mesinfos-btn save">Enregistrer</button>
                      <button onClick={() => setEditField(null)} className="mesinfos-btn cancel">Annuler</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit('motDePasse', '')} className="mesinfos-btn edit">Modifier</button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleDelete} className="mesinfos-btn delete">
            Supprimer mon compte
          </button>
          <div className="mesinfos-message">{message}</div>
        </div>
      </div>
    </>
  );
}

export default MesInfos;