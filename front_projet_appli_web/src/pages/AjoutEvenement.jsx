import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import './style/AjoutEvenement.css';

function AjoutEvent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    nomEvent: '',
    description: '',
    niveau: 'DEBUTANT',
    type: 'COURSE_3KM',
    lieu: '',
    dateEvent: '',
    heure: '',
    nombreParticipantsMax: '',
    op: 'ajoutEvent',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
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
        .then(data => setUser(data))
        .catch(err => console.error('Erreur chargement utilisateur:', err));
    }
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (
      !formData.nomEvent ||
      !formData.description ||
      !formData.lieu ||
      !formData.dateEvent ||
      !formData.heure ||
      !formData.nombreParticipantsMax
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (isNaN(formData.nombreParticipantsMax) || Number(formData.nombreParticipantsMax) <= 0) {
      setError("Le nombre de participants doit être un nombre positif.");
      return;
    }
    const payload = {
      nomEvent: formData.nomEvent,
      nomOrganisateur: user ? user.pseudo : '',
      description: formData.description,
      niveau: formData.niveau,
      typeEvent: formData.type,
      lieu: formData.lieu,
      date: formData.dateEvent,
      debutHoraire: formData.heure,
      nombreParticipantsMax: Number(formData.nombreParticipantsMax),
      op: formData.op,
    };
    fetch('http://localhost:8081/api/event/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'évènement");
        }
        setSuccess("Évènement ajouté avec succès !");
        setTimeout(() => navigate('/accueil'), 1200);
      })
      .catch((error) => {
        setError("Une erreur est survenue lors de l'ajout de l'évènement.");
      });
  }

  return (
    <>
      <Navigation />
      <div className="ajout-event-main-bg">
        <Container className="ajout-event-container py-4">
          <h1 className="mb-4 ajout-event-title">Ajouter un nouvel événement</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit} className="ajout-event-form bg-dark p-4 rounded shadow-sm">
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nom de l'évènement</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="nomEvent" 
                    value={formData.nomEvent} 
                    onChange={handleChange} 
                    placeholder="Nom de l'événement" 
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nom de l'organisateur</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={user?.pseudo || ''} 
                    disabled 
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nombre de participants maximal</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="nombreParticipantsMax" 
                    value={formData.nombreParticipantsMax} 
                    onChange={handleChange} 
                    min="1" 
                    placeholder="50" 
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description de l'évènement</Form.Label>
              <Form.Control 
                as="textarea" 
                name="description" 
                rows={4} 
                placeholder="Description détaillée de l'événement..." 
                value={formData.description} 
                onChange={handleChange} 
              />
            </Form.Group>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Niveau</Form.Label>
                  <Form.Select name="niveau" value={formData.niveau} onChange={handleChange}>
                    <option value="DEBUTANT">Débutant</option>
                    <option value="INTERMEDIAIRE">Intermédiaire</option>
                    <option value="AVANCE">Avancé</option>
                    <option value="EXPERT">Expert</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Select name="type" value={formData.type} onChange={handleChange}>
                    <option value="COURSE_3KM">Course 3km</option>
                    <option value="COURSE_5KM">Course 5km</option>
                    <option value="COURSE_10KM">Course 10km</option>
                    <option value="SEMI_MARATHON">Semi-marathon</option>
                    <option value="MARATHON">Marathon</option>
                    <option value="RELAIS">Relais</option>
                    <option value="COURSE_A_PIED">Course à pied</option>
                    <option value="COURSE_OBSTACLE">Course obstacle</option>
                    <option value="AUTRE">Autre</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Lieu de départ</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="lieu" 
                    placeholder="Adresse ou lieu précis" 
                    value={formData.lieu} 
                    onChange={handleChange} 
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="dateEvent" 
                    value={formData.dateEvent} 
                    onChange={handleChange} 
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Heure</Form.Label>
                  <Form.Control 
                    type="time" 
                    name="heure" 
                    value={formData.heure} 
                    onChange={handleChange} 
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">Ajouter l'évènement</Button>
          </Form>
        </Container>
      </div>
    </>
  );
}

export default AjoutEvent;
