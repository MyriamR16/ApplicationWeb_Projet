import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image_runners from '../assets/runner_2.jpg';
import './style/Connexion.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

function Connexion() {
  const navigate = useNavigate();
  const [valuePseudo, setValuePseudo] = useState('');
  const [valuePassword, setValuePassword] = useState('');

  function handlePseudoChange(event) {
    setValuePseudo(event.target.value);
  }

  function handlePasswordChange(event) {
    setValuePassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
<<<<<<< HEAD
    fetch('http://localhost:8081/api/user/login', {
=======
    console.log('handleSubmit appelé');

    fetch('http://localhost:8081/api/auth/login', {
>>>>>>> main
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pseudo: valuePseudo,
        motDePasse: valuePassword,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
<<<<<<< HEAD
          navigate('/accueil');
=======
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('role', data.role); 
          navigate('/accueil'); // redirection
>>>>>>> main
        } else {
          const errorMessage = await response.text();
          alert(errorMessage);
        }
      })
      .catch((error) => {
        console.error('Erreur réseau:', error);
        alert('Erreur lors de la connexion, réessayez plus tard.');
      });
  }

  return (
<<<<<<< HEAD
    <div className="connexion-container">
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card className="connexion-card p-4" style={{ maxWidth: '800px', width: '100%', boxShadow: '0 8px 32px rgba(10, 155, 143, 0.612)' }}>
          <Row className="g-0 align-items-stretch">
            <Col md={7} className="p-3 d-flex flex-column justify-content-center align-items-center">
              <h2 className="connexion-title text-center mb-4">Connexion</h2>
              <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }} className="d-flex flex-column align-items-center">
                <Form.Group className="mb-3 w-100" controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder="Votre Email"
                    value={valueEmail}
                    onChange={handleEmailChange}
                    required
                    className="connexion-input"
                  />
                </Form.Group>
                <Form.Group className="mb-3 w-100" controlId="formPassword">
                  <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    value={valuePassword}
                    onChange={handlePasswordChange}
                    required
                    className="connexion-input"
                  />
                </Form.Group>
                <Button variant="info" type="submit" className="connexion-button w-100 mb-2" style={{ color: '#008080', fontWeight: 700 }}>
                  Se connecter
                </Button>
              </Form>
              <div className="connexion-link text-center mt-2">
                <a href="/inscription" className="connexion-link-text">Je n'ai pas encore de compte</a>
              </div>
            </Col>
            <Col md={5} className="connexion-image-section d-flex justify-content-center align-items-center p-0">
              <img
                src={image_runners}
                alt="Connexion Illustration"
                className="connexion-image img-fluid rounded h-100"
                style={{ objectFit: 'cover', maxHeight: 'none', width: '100%' }}
=======
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.formSection}>
          <h2 style={styles.title}>Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <input
                type="text"
                placeholder="Votre Pseudo"
                value={valuePseudo}
                onChange={handlePseudoChange}
                required
                style={styles.input}
>>>>>>> main
              />
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
}

export default Connexion;