import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import "./style/AjoutGroupeAmis.css";

function AjoutGroupeAmis() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
  });

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

    if (!formData.nom) {
      alert("Veuillez remplir le champ du nom du groupe.");
      return;
    }

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const payload = {
      nom: formData.nom,
      description: formData.description,
      admin: { id: Number(userId) },
    };

    fetch('http://localhost:8081/api/groupeamis/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout du groupe d'amis.");
        }
        alert("Groupe ajouté avec succès !");
        navigate('/listegroupes');
      })
      .catch((error) => {
        console.error('Erreur :', error);
        alert("Une erreur est survenue lors de l'ajout du groupe.");
      });
  }

  return (
    <div className="ajout-groupe-page">
      <Navigation />
      <Container className="py-4 d-flex flex-column align-items-center">
        <Card className="ajout-groupe-card">
          <Card.Body>
            <h1 className="ajout-groupe-title">Créer un nouveau groupe</h1>
            {user && (
              <div className="ajout-groupe-bonjour">
                Bonjour {user.pseudo} !
              </div>
            )}
            <Form onSubmit={handleSubmit} className="ajout-groupe-form">
              <Form.Group className="ajout-groupe-form-group">
                <Form.Label className="ajout-groupe-label">Nom du groupe :</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="ajout-groupe-input"
                  placeholder="Nom du groupe"
                  required
                />
              </Form.Group>
              <Form.Group className="ajout-groupe-form-group">
                <Form.Label className="ajout-groupe-label">Description du groupe :</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={5}
                  placeholder="Description détaillée du groupe..."
                  value={formData.description}
                  onChange={handleChange}
                  className="ajout-groupe-textarea"
                />
              </Form.Group>
              <Button type="submit" className="ajout-groupe-btn">Créer le groupe</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AjoutGroupeAmis;
