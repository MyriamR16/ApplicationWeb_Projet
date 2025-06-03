import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { useParams } from 'react-router-dom';
import "./style/GroupeAmis.css";

function GroupeAmis() {
  const { id } = useParams();
  const [groupe, setGroupe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editNom, setEditNom] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAdminId, setEditAdminId] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (userId && token) {
      fetch(`http://localhost:8081/api/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setUser(data));
    }
    fetch(`http://localhost:8081/api/groupeamis/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du groupe');
        return res.json();
      })
      .then(data => {
        setGroupe(data);
        setEditNom(data.nom);
        setEditDescription(data.description);
        setEditAdminId(data.admin ? data.admin.id : "");
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  function handleEditSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    // Met à jour le groupe
    fetch(`http://localhost:8081/api/groupeamis/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nom: editNom,
        description: editDescription,
        admin: { id: Number(editAdminId) }
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la modification');
        // On recharge le groupe pour avoir le nouvel admin à jour
        return fetch(`http://localhost:8081/api/groupeamis/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      })
      .then(res => res.json())
      .then(data => {
        setGroupe(data);
        setEditMode(false);
        // Met à jour le titre de la discussion associée si besoin
        if (editNom && data.discussion && data.discussion.id) {
          fetch(`http://localhost:8081/api/discussion/${data.discussion.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              id: data.discussion.id,
              titre: editNom,
              groupeAmis: { id: data.id }
            })
          })
          .then(res => {
            if (!res.ok) throw new Error('Erreur lors de la mise à jour du titre de la discussion');
            // Pas besoin de setState ici, la synchro se fait au prochain chargement
          })
          .catch(err => alert(err.message));
        }
      })
      .catch(err => alert(err.message));
  }

  function handleDeleteGroupe() {
    if(window.confirm('Voulez-vous vraiment supprimer ce groupe ? Cette action est irréversible.')) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8081/api/groupeamis/${groupe.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Erreur lors de la suppression du groupe');
          window.location.href = '/listegroupes';
        })
        .catch(err => alert(err.message));
    }
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!groupe) return <div>Groupe introuvable</div>;

  return (
    <div className="groupe-amis-page">
      <Navigation />
      <Container className="py-4 d-flex justify-content-center">
        <Card className="groupe-amis-card p-4" style={{ maxWidth: 700, width: '100%' }}>
          {user && groupe.admin && user.id === groupe.admin.id && !editMode && (
            <div className="groupe-amis-actions">
              <Button className="groupe-amis-btn-modifier" onClick={() => setEditMode(true)}>Modifier le groupe</Button>
              <Button className="groupe-amis-btn-supprimer" onClick={handleDeleteGroupe}>Supprimer le groupe</Button>
            </div>
          )}
          {editMode ? (
            <form onSubmit={handleEditSubmit} className="mb-3">
              <Row className="mb-2">
                <Col>
                  <label>Nom du groupe :</label>
                  <input value={editNom} onChange={e => setEditNom(e.target.value)} className="form-control" required />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <label>Description :</label>
                  <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="form-control" rows={3} />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <label>Admin du groupe :</label>
                  <select value={editAdminId} onChange={e => setEditAdminId(e.target.value)} className="form-select" required>
                    {groupe.membres && groupe.membres.map(m => (
                      <option key={m.id} value={m.id}>{m.pseudo}</option>
                    ))}
                  </select>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                <Button type="submit" variant="success">Enregistrer</Button>
                <Button type="button" variant="danger" onClick={() => setEditMode(false)}>Annuler</Button>
              </div>
            </form>
          ) : null}
          <h1 className="groupe-amis-title mb-3">{groupe.nom || <span className="text-danger">Nom manquant</span>}</h1>
          <p className="groupe-amis-desc mb-3">{groupe.description || <span className="text-danger">Description manquante</span>}</p>
          <div className="mb-3">
            <strong>Admin :</strong> {groupe.admin ? groupe.admin.pseudo : <span className="text-danger">Non défini</span>}
          </div>
          <div className="mb-3">
            <strong>Membres du groupe :</strong>
            <ListGroup className="mt-2">
              {groupe.membres && groupe.membres.length > 0 ? (
                groupe.membres.map(membre => (
                  <ListGroup.Item key={membre.id} className="d-flex align-items-center">
                    <span style={{ fontSize: 16 }}>{membre.pseudo}</span>
                    {groupe.admin && membre.id === groupe.admin.id && (
                      <Badge bg="warning" text="dark" className="ms-2">Admin</Badge>
                    )}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>Aucun membre pour l'instant.</ListGroup.Item>
              )}
            </ListGroup>
          </div>
          <div className="text-center mt-4">
            <Button
              href={`/discussion/${groupe.id}`}
              className="groupe-amis-btn-discussion"
            >
              Discussion du groupe
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default GroupeAmis;
