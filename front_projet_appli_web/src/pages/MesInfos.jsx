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

  if (!user) return <div style={styles.centered}>Chargement...</div>;

  const fields = [
    { label: 'Nom', key: 'nom' },
    { label: 'Prénom', key: 'prenom' },
    { label: 'Email', key: 'email' },
    { label: 'Niveau', key: 'niveau' },
    { label: 'Pseudo', key: 'pseudo' },
    // Ajoute d'autres champs si besoin
  ];

  return (
    <div style={styles.page}>
      <Navigation />
      <div style={styles.content}>
        <h2 style={styles.title}>Mes infos</h2>
        <table style={styles.table}>
          <tbody>
            {fields.map(({ label, key }) => (
              <tr key={key}>
                <td style={styles.tdLabel}>{label}</td>
                <td style={styles.tdValue}>
                  {editField === key ? (
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      value={editValue}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  ) : (
                    user[key]
                  )}
                </td>
                <td style={styles.tdAction}>
                  {editField === key ? (
                    <>
                      <button onClick={() => handleSave(key)} style={styles.saveBtn}>Enregistrer</button>
                      <button onClick={() => setEditField(null)} style={styles.cancelBtn}>Annuler</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(key, user[key])} style={styles.editBtn}>Modifier</button>
                  )}
                </td>
              </tr>
            ))}
            {/* Mot de passe */}
            <tr>
              <td style={styles.tdLabel}>Mot de passe</td>
              <td style={styles.tdValue}>
                {editField === 'motDePasse' ? (
                  <input
                    type="password"
                    value={editValue}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Nouveau mot de passe"
                  />
                ) : (
                  '********'
                )}
              </td>
              <td style={styles.tdAction}>
                {editField === 'motDePasse' ? (
                  <>
                    <button onClick={() => handleSave('motDePasse')} style={styles.saveBtn}>Enregistrer</button>
                    <button onClick={() => setEditField(null)} style={styles.cancelBtn}>Annuler</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit('motDePasse', '')} style={styles.editBtn}>Modifier</button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={handleDelete} style={styles.deleteBtn}>
          Supprimer mon compte
        </button>
        <div style={styles.message}>{message}</div>
      </div>
    </div>
  );
}

export default MesInfos;

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: '#f5f7fa',
    position: 'relative',
    overflow: 'hidden',
  },
  centered: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f7fa',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    margin: '40px auto 0 auto',
    maxWidth: 700,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px 32px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    fontSize: '28px',
    marginBottom: '24px',
    fontWeight: '700',
    textAlign: 'center'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 30,
    background: 'white',
  },
  tdLabel: {
    padding: 8,
    fontWeight: 500,
    width: 120,
    background: '#f7f7f7'
  },
  tdValue: {
    padding: 8,
    width: 220,
    background: '#fafbfc'
  },
  tdAction: {
    padding: 8,
    width: 120,
    textAlign: 'center',
    background: '#f7f7f7'
  },
  input: {
    padding: 6,
    width: '90%',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 15,
  },
  editBtn: {
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    marginRight: 5,
  },
  saveBtn: {
    background: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    marginRight: 5,
  },
  cancelBtn: {
    background: "#e67e22",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  deleteBtn: {
    color: 'white',
    background: '#e74c3c',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 15,
    marginTop: 10,
    cursor: 'pointer'
  },
  message: {
    marginTop: 20,
    color: '#27ae60',
    fontWeight: 600,
    textAlign: 'center'
  }
};