import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';

import './style/Profil.css';

function Profil() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8081/api/user/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur chargement utilisateur :', error);
        setError('Impossible de charger le profil utilisateur.');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="profil-page">
       <Navigation />
      <div className="profil-content">
        
        <h1 className="profil-title">Profil</h1>

        {loading && <p>Chargement du profil...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && user ? (
          <div className="profil-profile-container">
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