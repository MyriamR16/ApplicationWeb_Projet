import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import fondImage from '../assets/fond_page.jpg'; // Remplace par le bon nom de fichier

function Accueil() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=43.6&longitude=1.44&current_weather=true')
      .then((response) => response.json())
      .then((data) => setWeather(data.current_weather))
      .catch((error) => console.error('Erreur météo:', error));
  }, []);

  return (
    <div style={styles.page}>
      <img src={fondImage} alt="fond" style={styles.backgroundImage} />

      <div style={styles.content}>
        <Navigation />
        <h1 style={styles.title}>Run7 - Accueil</h1>
        <p style={styles.subtitle}>Bienvenue sur la page d'accueil de Run7 !</p>

        {weather && (
          <div style={styles.weather}>
            <p>📍 Météo à Toulouse</p>
            <p>🌡 Température : <strong>{weather.temperature}°C</strong></p>
            <p>💨 Vent : <strong>{weather.windspeed} km/h</strong></p>
          </div>
        )}
      </div>
    </div>

          // Tableau de bord personnel :
          //   "Statistiques de course (km parcourus ce mois-ci, objectifs atteints, etc.)",
          //   "Progression sous forme de graphique (ex : courbe de performance).",
          //   "Dernières activités enregistrées (date, distance, temps).",

          // Événements à venir:
          //   "Liste des courses/événements sportifs auxquels l'utilisateur est inscrit.",
          //   "Suggestions d'événements populaires près de chez lui.",
        
      
          // Défis & Récompenses:
          //   'Badges à débloquer (ex : "5 km en moins de 25 min").',
          //   "Classement amical (comparaison avec les amis).",
          //   "Récompenses (réductions chez des partenaires sportifs).",
        
          // Motivation
          //   "Citation inspirante aléatoire.",
          //   "Météo locale (pour encourager à courir aujourd’hui).",

          //   "Musique recommandée (playlist Spotify ou autre).",




  );
}

export default Accueil;

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
    backgroundColor: 'white',
    borderRadius: '2vw',
    padding: '4vh 4vw',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '30px',
  },
  weather: {
    fontSize: '16px',
    backgroundColor: '#f0f8ff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    lineHeight: '1.6',
  },
};
