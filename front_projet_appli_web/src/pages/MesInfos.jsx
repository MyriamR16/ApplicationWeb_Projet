import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

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

  if (!user) return <div>Chargement...</div>;

  const fields = [
    { label: 'Nom', key: 'nom' },
    { label: 'Prénom', key: 'prenom' },
    { label: 'Email', key: 'email' },
    { label: 'Niveau', key: 'niveau' },
    { label: 'Pseudo', key: 'pseudo' },
    // Ajoute d'autres champs si besoin
  ];

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <Navigation />
      <h2>Mes infos</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
        <tbody>
          {fields.map(({ label, key }) => (
            <tr key={key}>
              <td style={{ padding: 8, fontWeight: 500 }}>{label}</td>
              <td style={{ padding: 8 }}>
                {editField === key ? (
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    value={editValue}
                    onChange={handleChange}
                    style={{ padding: 4, width: '90%' }}
                  />
                ) : (
                  user[key]
                )}
              </td>
              <td style={{ padding: 8 }}>
                {editField === key ? (
                  <>
                    <button onClick={() => handleSave(key)} style={{ marginRight: 5 }}>Enregistrer</button>
                    <button onClick={() => setEditField(null)}>Annuler</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(key, user[key])}>Modifier</button>
                )}
              </td>
            </tr>
          ))}
          {/* Mot de passe */}
          <tr>
            <td style={{ padding: 8, fontWeight: 500 }}>Mot de passe</td>
            <td style={{ padding: 8 }}>
              {editField === 'motDePasse' ? (
                <input
                  type="password"
                  value={editValue}
                  onChange={handleChange}
                  style={{ padding: 4, width: '90%' }}
                  placeholder="Nouveau mot de passe"
                />
              ) : (
                '********'
              )}
            </td>
            <td style={{ padding: 8 }}>
              {editField === 'motDePasse' ? (
                <>
                  <button onClick={() => handleSave('motDePasse')} style={{ marginRight: 5 }}>Enregistrer</button>
                  <button onClick={() => setEditField(null)}>Annuler</button>
                </>
              ) : (
                <button onClick={() => handleEdit('motDePasse', '')}>Modifier</button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleDelete} style={{ color: 'white', background: '#e74c3c', border: 'none', padding: '10px 20px', borderRadius: 6 }}>
        Supprimer mon compte
      </button>
      <div style={{ marginTop: 20, color: '#27ae60' }}>{message}</div>
    </div>
  );
}

export default MesInfos;