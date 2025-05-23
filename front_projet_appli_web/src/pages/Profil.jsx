import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navigation from '../components/Navigation';
import fondImage from '../assets/fond_page.jpg';

function Profil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userFromToken, setUserFromToken] = useState(null);
  const [userFromApi, setUserFromApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/connexion');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const decodedToken = jwtDecode(token);
      setUserFromToken(decodedToken);
      const userIdToFetch = id || decodedToken.id;
      fetch(`http://localhost:8082/api/user/${userIdToFetch}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setUserFromApi(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erreur chargement utilisateur :', error);
          setError('Impossible de charger le profil utilisateur.');
          setLoading(false);
        });
    } catch (e) {
      console.error('Erreur de décodage du token:', e);
      setError('Token invalide');
      setLoading(false);
      navigate('/connexion');
    }
  }, [id, token, navigate]);

  // Détermine l'utilisateur à afficher (API prioritaire, sinon token)
  const user = userFromApi || userFromToken;

  return (
    <div style={styles.page}>
      <img src={fondImage} alt="fond" style={styles.backgroundImage} />

      <div style={styles.content}>
        <Navigation />
        <h1 style={styles.title}>Profil {user?.pseudo ? `- ${user.pseudo}` : ''}</h1>

        {loading && <p>Chargement du profil...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && user ? (
          <div style={styles.profileContainer}>
            <div style={styles.info}>
              <p><strong>Nom :</strong> {user.nom}</p>
              <p><strong>Prénom :</strong> {user.prenom}</p>
              <p><strong>Pseudo :</strong> {user.pseudo}</p>
              <p><strong>Email :</strong> {user.email}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && !user && (
          <p>Aucun utilisateur trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default Profil;

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    margin: '3vh auto',
    width: '85%',
    maxWidth: 800,
    backgroundColor: 'white',
    borderRadius: '2vw',
    padding: '4vh 4vw',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
    fontWeight: '700',
    textAlign: 'center',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '15px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  info: {
    fontSize: '16px',
    lineHeight: '1.8',
    width: '100%',
  },
  editButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#5da7db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};