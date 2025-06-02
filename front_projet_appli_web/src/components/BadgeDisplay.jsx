import React from 'react';

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
          <div className="badge-label">{badge.nom}</div>
        </div>
      ))}
    </div>
  );
}

export default BadgeDisplay;