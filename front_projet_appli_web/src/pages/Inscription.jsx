import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image_runners from '../assets/runner_3.png';
import './style/Inscription.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

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

  function handleCheckbox(e) {
    setIsModerateur(e.target.checked);
    setFormData(prev => ({
      ...prev,
      role: e.target.checked ? 'MODERATEUR' : 'USER'
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isPasswordStrong(formData.motDePasse)) {
      alert('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
      return;
    }

    if (formData.motDePasse !== formData.motDePasseConfirm) {
      alert("Les mots de passe ne correspondent pas.");
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

    fetch('http://localhost:8081/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
        alert('Inscription réussie !');
        navigate('/connexion');
      })
      .catch((error) => {
        console.error('Erreur :', error);
<<<<<<< HEAD
        if (error.message.includes('Pseudo déjà utilisé')) {
          alert('Ce pseudo est déjà utilisé. Veuillez en choisir un autre.');
        } else {
          alert(error.message);
        }
      });
=======

        if (error.message.includes('Pseudo déjà utilisé')) {
          alert('Ce pseudo est déjà utilisé. Veuillez en choisir un autre.');
        } else {
          alert(error.message); // Pour d'autres types d'erreurs
        }
      });

>>>>>>> main
  }

  function isPasswordStrong(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+=-])[A-Za-z\d@$!%*?&.#^()_+=-]{8,}$/;
    return regex.test(password);
  }



  return (
<<<<<<< HEAD
    <div className="inscription-container">
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card className="inscription-card p-4">
          <Row className="g-0 align-items-stretch">
            <Col md={7} className="p-3 d-flex flex-column justify-content-center align-items-center">
              <h2 className="inscription-title text-center mb-4">Inscription</h2>
              <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }} className="d-flex flex-column ">
               
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
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3 w-100">
                  <Form.Label>Niveau :</Form.Label>
                  <Form.Select
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleChange}
                    className="inscription-input"
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
                  />
                </Form.Group>
                <Button type="submit" className="inscription-button w-100 mb-2">
                  S'inscrire
                </Button>
              </Form>
              <div className="text-center mt-2">
                <a href="/connexion" className="inscription-link-text">J'ai déjà un compte</a>
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
=======
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.formSection}>
          <h2 style={styles.title}>Inscription</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label>
                <input type="checkbox" checked={isModerateur} onChange={handleCheckbox} />
                Je veux être modérateur
              </label>
            </div>
            <div style={styles.formGroup}>
              <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <input type="text" name="pseudo" placeholder="Pseudo" value={formData.pseudo} onChange={handleChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
            </div>
            <div>
              <label htmlFor="niveau">Niveau :</label>
              <select name="niveau" value={formData.niveau} onChange={handleChange} disabled={isModerateur}>
                <option value="DEBUTANT">DEBUTANT</option>
                <option value="INTERMEDIAIRE">INTERMEDIAIRE</option>
                <option value="AVANCE">AVANCE</option>
                <option value="EXPERT">EXPERT</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <input type="password" name="motDePasse" placeholder="Mot de passe" value={formData.motDePasse} onChange={handleChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <input type="password" name="motDePasseConfirm" placeholder="Confirmer le mot de passe" value={formData.motDePasseConfirm} onChange={handleChange} required style={styles.input} />
            </div>
            <input type="hidden" name="role" value={formData.role} />
            <button type="submit" style={styles.button}>S'inscrire</button>
          </form>
          <div style={styles.link}>
            <a href="/connexion" style={styles.linkText}>J'ai déjà un compte</a>
          </div>
        </div>
        <div style={styles.imageSection}>
          <img
            src={image_runners}
            alt="Inscription Illustration"
            style={styles.image}
          />
        </div>
      </div>
>>>>>>> main
    </div>
  );
}

export default Inscription;




































