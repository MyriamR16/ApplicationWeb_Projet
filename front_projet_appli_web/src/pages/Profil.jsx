import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import './style/Profil.css';

function Profil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (token && userId) {
        fetch(`http://localhost:8081/api/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            if (!res.ok) throw new Error('Erreur HTTP ' + res.status);
            return res.json();
          })
          .then(data => {
            setUser(data);
            setLoading(false);
          })
          .catch(err => {
            setUser(null);
            setError("Erreur lors du chargement du profil utilisateur.");
            setLoading(false);
            console.error('Erreur chargement utilisateur:', err);
          });
      } else {
        setLoading(false);
        setError("Utilisateur non authentifié.");
      }
    } catch (err) {
      setError("Erreur inattendue dans le composant Profil.");
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="profil-error">
        {error}
      </div>
    );
  }

  return (
    <div className="profil-page">
      <div className="profil-content">
        <Navigation />
        {user && (
          <div className="profil-welcome">
            Bonjour <strong>{user.pseudo}</strong> !
          </div>
        )}
        <h1 className="profil-title">Profil</h1>

        {loading && <p>Chargement du profil...</p>}

        {!loading && !error && user ? (
          <div className="profil-profile-container">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.pseudo || user.id)}`}
              alt="Avatar"
              className="profil-avatar"
            />
            <div className="profil-info">
              <p><strong>ID :</strong> {user.id}</p>
              <p><strong>Nom :</strong> {user.nom}</p>
              <p><strong>Prénom :</strong> {user.prenom}</p>
              <p><strong>Pseudo :</strong> {user.pseudo}</p>
              <p><strong>Email :</strong> {user.email}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && !user && (
          <p>Aucun utilisateur trouvé pour cet ID.</p>
        )}
      </div>
    </div>
  );
}

export default Profil;

const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f9',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
  },
  content: {
    maxWidth: 800,
    width: '100%',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  info: {
    flex: 1,
    fontSize: '16px',
    color: '#555',
  },
};
