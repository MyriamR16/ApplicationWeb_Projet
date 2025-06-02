import React from 'react';

const badgeImages = {
  COURSE_3KM: '/src/assets/badges/badge_3k.png',
  COURSE_5KM: '/src/assets/badges/badge_5k.png',
  COURSE_10KM: '/src/assets/badges/badge_10k.png',
  SEMI_MARATHON: '/src/assets/badges/badge_semi.png',
  MARATHON: '/src/assets/badges/badge_marathon.png',
  RELAIS: '/src/assets/badges/badge_relais.png',
  COURSE_A_PIED: '/src/assets/badges/badge_courseapied.png',
  COURSE_OBSTACLE: '/src/assets/badges/badge_obstacle.png',
  AUTRE: '/src/assets/badges/badge_autre.png',
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