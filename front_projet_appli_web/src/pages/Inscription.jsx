 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image_runners from '../assets/inscription_runners.jpg';

function Inscription() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    pseudo: '',
    email: '',
    niveau : 'DEBUTANT',
    motDePasse: '',
    motDePasseConfirm: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  //Lien avec le backend
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
    };

    fetch('http://localhost:8081/api/user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
     .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'inscription");
        }
        // Si le backend ne renvoie pas de JSON :
        alert('Inscription réussie !');
        navigate('/connexion');
      })
      .catch((error) => {
        console.error('Erreur :', error);
        alert("Une erreur est survenue lors de l'inscription.");
      });
  }



  function isPasswordStrong(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+=-])[A-Za-z\d@$!%*?&.#^()_+=-]{8,}$/;
    return regex.test(password);
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.formSection}>
          <h2 style={styles.title}>Inscription</h2>
          <form onSubmit={handleSubmit}>
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
              <select name="niveau" value={formData.niveau} onChange={handleChange}>
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
    </div>
  );
}

export default Inscription;

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
