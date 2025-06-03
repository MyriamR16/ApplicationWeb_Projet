import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';
import { Container, Card, ListGroup, Button } from 'react-bootstrap';
import "./style/ListeDiscussions.css";


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
    <div className="liste-discussions-page">
      <Navigation />
      <Container className="py-4 d-flex flex-column align-items-center">
        <Card className="liste-discussions-card">
          <Card.Body>
            <h2 className="liste-discussions-title">Mes discussions de groupe</h2>
            {discussions.length === 0 ? (
              <div className="liste-discussions-empty">Aucune discussion trouvée.</div>
            ) : (
              <ListGroup variant="flush">
                {discussions.map(disc => (
                  <ListGroup.Item key={disc.id} className="liste-discussions-item">
                    <div className="liste-discussions-groupe">{disc.groupeNom}</div>
                    <div className="liste-discussions-titre">{disc.titre}</div>
                    <Button as={Link} to={`/discussion/${disc.groupeId}`} className="liste-discussions-btn">Ouvrir la discussion</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ListeDiscussions;
