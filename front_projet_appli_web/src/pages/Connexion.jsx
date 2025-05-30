import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image_runners from '../assets/connexion_runners.jpg';

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
    console.log('handleSubmit appelé');

    fetch('http://localhost:8081/api/auth/login', {
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
          localStorage.setItem('userId', data.userId);
          navigate('/accueil'); // redirection
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
              />
            </div>
            <div style={styles.formGroup}>
              <input
                type="password"
                placeholder="Mot de passe"
                value={valuePassword}
                onChange={handlePasswordChange}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button}>Se connecter</button>
          </form>
          <div style={styles.link}>
            <a href="/inscription" style={styles.linkText}>Je n'ai pas encore de compte</a>
          </div>
        </div>
        <div style={styles.imageSection}>
          <img
            src={image_runners}
            alt="Connexion Illustration"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
}

export default Connexion;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    display: 'flex',
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    width: '800px',
    maxWidth: '95%',
  },
  formSection: {
    flex: 1,
    padding: '40px',
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #ccc',
    padding: '10px',
    fontSize: '16px',
    background: 'transparent',
    outline: 'none',
  },
  button: {
    backgroundColor: '#5da7db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 30px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
  link: {
    marginTop: '20px',
    textAlign: 'right',
    fontSize: '14px',
  },
  linkText: {
    textDecoration: 'underline',
    color: '#000',
  },
  imageSection: {
    flex: 1,
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
};
