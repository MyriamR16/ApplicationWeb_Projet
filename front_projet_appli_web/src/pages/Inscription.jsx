import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import image_runners from '../assets/runner_3.png';
import './style/Inscription.css';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

function Inscription() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    pseudo: '',
    email: '',
    niveau: 'DEBUTANT',
    motDePasse: '',
    motDePasseConfirm: '',
    role: 'USER',
  });

  const [isModerateur, setIsModerateur] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleCheckbox(e) {
    const checked = e.target.checked;
    setIsModerateur(checked);
    setFormData(prev => ({
      ...prev,
      role: checked ? 'MODERATEUR' : 'USER'
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function isPasswordStrong(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+=-])[A-Za-z\d@$!%*?&.#^()_+=-]{8,}$/;
    return regex.test(password);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isPasswordStrong(formData.motDePasse)) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
      return;
    }

    if (formData.motDePasse !== formData.motDePasseConfirm) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      pseudo: formData.pseudo,
      email: formData.email,
      niveau: formData.niveau,
      motDePasse: formData.motDePasse,
      role: formData.role,
    };

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setSuccessMessage('Inscription réussie ! Vous allez être redirigé(e) vers la connexion...');
      setTimeout(() => navigate('/connexion'), 2000);
    } catch (error) {
      console.error('Erreur :', error);
      if (error.message.includes('Pseudo déjà utilisé')) {
        setErrorMessage('Ce pseudo est déjà utilisé. Veuillez en choisir un autre.');
      } else {
        setErrorMessage(error.message);
      }
    }
  }

  return (
    <div className="inscription-container">
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card className="inscription-card p-4">
          <Row className="g-0 align-items-stretch">
            <Col md={7} className="p-3 d-flex flex-column justify-content-center align-items-center">
              <h2 className="inscription-title text-center mb-4">Inscription</h2>

              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}

              <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }} className="d-flex flex-column ">
                <Form.Group className="mb-3 d-flex align-items-center">
                  <Form.Check 
                    type="checkbox"
                    id="moderateur-checkbox"
                    label="Je veux être modérateur"
                    checked={isModerateur}
                    onChange={handleCheckbox}
                  />
                </Form.Group>

                <Row className="w-100">
                  <Col>
                    <Form.Group className="mb-3 w-100">
                      <Form.Control
                        type="text"
                        placeholder="Prénom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        className="inscription-input"
                        required
                        aria-label="Prénom"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3 w-100">
                      <Form.Control
                        type="text"
                        placeholder="Nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className="inscription-input"
                        required
                        aria-label="Nom"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="w-100 align-items-stretch mb-separation">
                  <Col className="d-flex align-items-stretch">
                    <Form.Group className="mb-3 w-100 h-100 d-flex align-items-stretch">
                      <Form.Control
                        type="text"
                        placeholder="Pseudo"
                        name="pseudo"
                        value={formData.pseudo}
                        onChange={handleChange}
                        className="inscription-input h-100"
                        required
                        aria-label="Pseudo"
                      />
                    </Form.Group>
                  </Col>
                  <Col className="d-flex align-items-stretch">
                    <Form.Group className="mb-3 w-100 h-100 d-flex align-items-stretch">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="inscription-input h-100"
                        required
                        aria-label="Email"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3 w-100">
                  <Form.Label htmlFor="niveau">Niveau :</Form.Label>
                  <Form.Select
                    id="niveau"
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleChange}
                    className="inscription-input"
                    disabled={isModerateur}
                    aria-label="Niveau"
                  >
                    <option value="DEBUTANT">DEBUTANT</option>
                    <option value="INTERMEDIAIRE">INTERMEDIAIRE</option>
                    <option value="AVANCE">AVANCE</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3 w-100">
                  <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    name="motDePasse"
                    value={formData.motDePasse}
                    onChange={handleChange}
                    className="inscription-input"
                    required
                    aria-label="Mot de passe"
                  />
                </Form.Group>

                <Form.Group className="mb-3 w-100">
                  <Form.Control
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    name="motDePasseConfirm"
                    value={formData.motDePasseConfirm}
                    onChange={handleChange}
                    className="inscription-input"
                    required
                    aria-label="Confirmer le mot de passe"
                  />
                </Form.Group>

                <Button type="submit" className="inscription-button w-100 mb-2">
                  S'inscrire
                </Button>
              </Form>

              <div className="text-center mt-2">
                <Link to="/connexion" className="inscription-link-text">
                  J'ai déjà un compte
                </Link>
              </div>
            </Col>

            <Col md={5} className="inscription-image-section d-flex justify-content-center align-items-center p-0">
              <img
                src={image_runners}
                alt="Inscription Illustration"
                className="inscription-image img-fluid rounded h-100"
                style={{ objectFit: 'cover', maxHeight: 'none', width: '100%' }}
              />
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
}

export default Inscription;
