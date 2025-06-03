import React from 'react';
import { getLevelColor } from '../pages/ListeInscrits';
import '../pages/style/ListeInscrits.css';

const badgeImages = {
  COURSE_3KM: '/src/assets/badges/3k.png',
  COURSE_5KM: '/src/assets/badges/5k.png',
  COURSE_10KM: '/src/assets/badges/10k.png',
  SEMI_MARATHON: '/src/assets/badges/semi.png',
  MARATHON: '/src/assets/badges/marathon.png',
  RELAIS: '/src/assets/badges/relais.png',
  COURSE_A_PIED: '/src/assets/badges/apied.png',
  COURSE_OBSTACLE: '/src/assets/badges/obstacles.png',
  AUTRE: '/src/assets/badges/autres.png',
};

function BadgeDisplay({ badges }) {
  if (!badges || badges.length === 0) return <p>Aucun badge obtenu pour l'instant.</p>;
  return (
    <div className="badges-container">
      {badges.map(badge => (
        <div key={badge.id} className="badge-item">
          <img
            src={badgeImages[badge.typeEvent] || badge.imageUrl}
            alt={badge.nom}
            className="badge-img"
          />
          <div className="badge-label" style={badge.niveau ? { backgroundColor: getLevelColor(badge.niveau), color: '#1B2A32', borderRadius: 10, padding: '2px 8px', fontWeight: 700, marginTop: 4 } : {}}>
            {badge.nom}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BadgeDisplay;