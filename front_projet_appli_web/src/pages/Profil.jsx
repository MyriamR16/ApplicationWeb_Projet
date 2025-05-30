import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import fondImage from '../assets/fond_page.jpg';

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
    <div style={styles.page}>
      <img src={fondImage} alt="fond" style={styles.backgroundImage} />

      <div style={styles.content}>
        <Navigation />
        {user && (
          <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '18px' }}>
            Bonjour {user.pseudo} !
          </div>
        )}
        <h1 style={styles.title}>Profil</h1>

        {loading && <p>Chargement du profil...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && user ? (
          <div style={styles.profileContainer}>
            <div style={styles.info}>
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
  },
};
