import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';

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
    <div style={styles.container}>
      <Navigation />
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Créer un nouveau groupe</h1>
        {user && (
          <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '18px' }}>
            Bonjour {user.pseudo} !
          </div>
        )}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom du groupe :</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              style={styles.input}
              placeholder="Nom du groupe"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description du groupe :</label>
            <textarea
              name="description"
              rows="5"
              placeholder="Description détaillée du groupe..."
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>
          <button type="submit" style={styles.submitButton}>Créer le groupe</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Open Sans', sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    paddingBottom: '50px',
  },
  formContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginTop: '30px',
  },
  title: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#34495e',
    fontSize: '14px',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #dfe6e9',
    fontSize: '16px',
  },
  textarea: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #dfe6e9',
    fontSize: '16px',
    resize: 'vertical',
    minHeight: '100px',
  },
  submitButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#27ae60',
    fontWeight: '500',
    textAlign: 'center',
  }
};

export default AjoutGroupeAmis;
