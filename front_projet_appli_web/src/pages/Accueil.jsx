import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import fondImage from '../assets/fond_page.jpg';

function Accueil() {
  const [weather, setWeather] = useState(null);
  const [user, setUser] = useState(null);
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=43.6&longitude=1.44&current_weather=true')
      .then((response) => response.json())
      .then((data) => setWeather(data.current_weather))
      .catch((error) => console.error('Erreur météo:', error));
  }, []);

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
        .then(data => setUser(data))
        .catch(err => {
          setUser(null);
          console.error('Erreur chargement utilisateur:', err);
        });
    }
  }, []);

  return (
    <div style={styles.page}>
      <img src={fondImage} alt="fond" style={styles.backgroundImage} />
      <Navigation />
      <div style={styles.content}>
        <h1 style={styles.title}>Run7 - Accueil</h1>
        {role === "MODERATEUR" ? (
          <>
            <p style={styles.subtitle}>Bienvenue sur la page d'accueil Modérateur !</p>
            <div>
              <p>Vous pouvez gérer les utilisateurs, groupes et événements.</p>
              <ul>
                <li>Supprimer des utilisateurs</li>
                <li>Supprimer des groupes</li>
                <li>Supprimer des événements</li>
                <li>Consulter la liste des inscrits</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <p style={styles.subtitle}>Bienvenue sur la page d'accueil de Run7 !</p>
            <div>
              {user && (
                <div>
                  <p>Bienvenue, {user.prenom} {user.nom} !</p>
                  <p>Pseudo : {user.pseudo}</p>
                </div>
              )}
            </div>
            {weather && (
              <div style={styles.weather}>
                <p>📍 Météo à Toulouse</p>
                <p>🌡 Température : <strong>{weather.temperature}°C</strong></p>
                <p>💨 Vent : <strong>{weather.windspeed} km/h</strong></p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Accueil;

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: '#f5f7fa',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: 0,
    opacity: 0.15
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
    fontSize: '32px',
    marginBottom: '20px',
    fontWeight: '700',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '30px',
    textAlign: 'center'
  },
  weather: {
    fontSize: '16px',
    backgroundColor: '#f0f8ff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    lineHeight: '1.6',
    marginTop: '20px',
    textAlign: 'center'
  },
};