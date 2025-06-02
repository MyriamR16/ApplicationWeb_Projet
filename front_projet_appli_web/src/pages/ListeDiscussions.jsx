import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

function ListeDiscussions() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      setUser(null);
      window.location.href = '/connexion';
      return;
    }
    fetch(`http://localhost:8081/api/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Utilisateur non trouvé');
        return res.json();
      })
      .then(data => {
        setUser(data);
        // Récupérer les groupes où il est membre
        fetch(`http://localhost:8081/api/groupeamis/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            if (!res.ok) throw new Error('Erreur lors du chargement des groupes');
            return res.json();
          })
          .then(groupes => {
            // Pour chaque groupe, récupérer la discussion
            Promise.all(groupes.map(groupe =>
              fetch(`http://localhost:8081/api/discussion/groupeamis/${groupe.id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              })
                .then(async res => {
                  if (!res.ok) return null;
                  // Vérifie que la réponse n'est pas vide avant de parser
                  const text = await res.text();
                  if (!text) return null;
                  try {
                    return { ...JSON.parse(text), groupeNom: groupe.nom, groupeId: groupe.id };
                  } catch {
                    return null;
                  }
                })
            )).then(discussions => {
              setDiscussions(discussions.filter(Boolean));
              setLoading(false);
            });
          });
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des discussions...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#ece5dd' }}>
      <Navigation />
      <div style={{ maxWidth: 600, margin: '30px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32 }}>
        <h2 style={{ color: '#075e54', marginBottom: 24 }}>Mes discussions de groupe</h2>
        {discussions.length === 0 ? (
          <div>Aucune discussion trouvée.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {discussions.map(disc => (
              <li key={disc.id} style={{ marginBottom: 18, background: '#f7f7f7', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ fontWeight: 600, fontSize: 18, color: '#075e54' }}>{disc.groupeNom}</div>
                <div style={{ color: '#333', fontSize: 15, marginBottom: 8 }}>{disc.titre}</div>
                <Link to={`/discussion/${disc.groupeId}`} style={{ color: '#3498db', fontWeight: 600, textDecoration: 'none' }}>Ouvrir la discussion</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ListeDiscussions;
