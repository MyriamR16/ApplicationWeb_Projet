import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import './style/Profil.css';

function Profil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="profil-page">
      <img src={fondImage} alt="fond" className="profil-background-image" />
      <div className="profil-content">
        <Navigation />
        {user && (
          <div className="profil-welcome">
            Bonjour <strong>{user.pseudo}</strong> !
          </div>
        )}
        <h1 className="profil-title">Profil</h1>

        {loading && <p>Chargement du profil...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && user && (
          <div className="profil-profile-container">
            <div className="profil-info">
              <p><strong>ID :</strong> {user.id}</p>
              <p><strong>Nom :</strong> {user.nom}</p>
              <p><strong>Prénom :</strong> {user.prenom}</p>
              <p><strong>Pseudo :</strong> {user.pseudo}</p>
              <p><strong>Email :</strong> {user.email}</p>
            </div>
          </div>
        )}

        {!loading && !error && !user && (
          <p>Aucun utilisateur trouvé pour cet ID.</p>
        )}
      </div>
    </div>
  );
}

export default Profil;
