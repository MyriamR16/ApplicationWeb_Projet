import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';

function AjoutEvent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    nomEvent: '',
    nomOrganisateur: '',
    description: '',
    niveau: 'DEBUTANT',
    type: 'COURSE_3KM',
    lieu: '',
    dateEvent: '',
    heure: '',
    nombreParticipantsMax: '',
    op: 'ajoutEvent',
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

    if (
      !formData.nomEvent ||
      !formData.nomOrganisateur ||
      !formData.description ||
      !formData.lieu ||
      !formData.dateEvent ||
      !formData.heure ||
      !formData.nombreParticipantsMax
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (isNaN(formData.nombreParticipantsMax) || Number(formData.nombreParticipantsMax) <= 0) {
      alert("Le nombre de participants doit être un nombre positif.");
      return;
    }

    const payload = {
      nomEvent: formData.nomEvent,
      nomOrganisateur: formData.nomOrganisateur,
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
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout de l'évènement");
        }
        alert("Évènement ajouté avec succès !");
        navigate('/accueil');
      })
      .catch((error) => {
        console.error('Erreur :', error);
        alert("Une erreur est survenue lors de l'ajout de l'évènement.");
      });
  }

  return (
    <div style={styles.container}>
      <Navigation />
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Ajouter un nouvel événement</h1>
        {user && (
          <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '18px' }}>
            Bonjour {user.pseudo} !
          </div>
        )}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom de l'évènement :</label>
            <input
              type="text"
              name="nomEvent"
              value={formData.nomEvent}
              onChange={handleChange}
              style={styles.input}
              placeholder="Nom de l'événement"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nom de l'organisateur :</label>
            <input
              type="text"
              name="nomOrganisateur"
              value={formData.nomOrganisateur}
              onChange={handleChange}
              style={styles.input}
              placeholder="Organisateur"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description de l'évènement :</label>
            <textarea
              name="description"
              rows="5"
              placeholder="Description détaillée de l'événement..."
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <div className="form-row" style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Niveau :</label>
              <select
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="DEBUTANT">Débutant</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="AVANCE">Avancé</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Type :</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="COURSE_3KM">Course 3km</option>
                <option value="COURSE_5KM">Course 5km</option>
                <option value="COURSE_10KM">Course 10km</option>
                <option value="SEMI_MARATHON">Semi-marathon</option>
                <option value="MARATHON">Marathon</option>
                <option value="RELAIS">Relais</option>
                <option value="COURSE_A_PIED">Course à pied</option>
                <option value="COURSE_OBSTACLE">Course obstacle</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Lieu de départ :</label>
            <input
              type="text"
              name="lieu"
              placeholder="Adresse ou lieu précis"
              value={formData.lieu}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div className="form-row" style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date de la course :</label>
              <input
                type="date"
                name="dateEvent"
                value={formData.dateEvent}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Heure de début :</label>
              <input
                type="time"
                name="heure"
                value={formData.heure}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre de participants maximal :</label>
            <input
              type="number"
              name="nombreParticipantsMax"
              value={formData.nombreParticipantsMax}
              onChange={handleChange}
              style={styles.input}
              min="1"
              placeholder="50"
            />
          </div>

          <button type="submit" style={styles.submitButton}>Créer l'événement</button>
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
  formRow: {
    display: 'flex',
    gap: '20px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '20px',
    },
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
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
    transition: 'all 0.3s',
    ':focus': {
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
      outline: 'none',
    },
  },
  textarea: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #dfe6e9',
    fontSize: '16px',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'all 0.3s',
    ':focus': {
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
      outline: 'none',
    },
  },
  select: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #dfe6e9',
    fontSize: '16px',
    backgroundColor: 'white',
    transition: 'all 0.3s',
    ':focus': {
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
      outline: 'none',
    },
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
    transition: 'all 0.3s',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
};

export default AjoutEvent;