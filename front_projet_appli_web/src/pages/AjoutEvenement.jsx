import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';

function AjoutEvent() {
  const navigate = useNavigate();

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

  function handleChange (event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  function handleSubmit(event) {
    event.preventDefault();

    // Vérification des champs obligatoires
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

    // Vérification que le nombre de participants est un nombre positif
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
    <div>
        <Navigation />
        <form onSubmit={handleSubmit} method="post" action="Serv">
            <div>
                Nom de l'évènement :
                <input type="text" name="nomEvent" value={formData.nomEvent} onChange={handleChange} />
            </div>

            <div>
                Nom de l'organisateur :
                <input type="text" name="nomOrganisateur" value={formData.nomOrganisateur} onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="description">Description de l'évènement :</label><br />
                <textarea
                name="description"
                id="description"
                rows="4"
                cols="50"
                placeholder="Entrez une description de l'événement..."
                value={formData.description}
                onChange={handleChange}
                ></textarea>
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

            <div>
                <label htmlFor="type">Type :</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="COURSE_3KM">COURSE_3KM</option>
                  <option value="COURSE_5KM">COURSE_5KM</option>
                  <option value="COURSE_10KM">COURSE_10KM</option>
                  <option value="SEMI_MARATHON">SEMI_MARATHON</option>
                  <option value="MARATHON">MARATHON</option>
                  <option value="RELAIS">RELAIS</option>
                  <option value="COURSE_A_PIED">COURSE_A_PIED</option>
                  <option value="COURSE_OBSTACLE">COURSE_OBSTACLE</option>
                  <option value="AUTRE">AUTRE</option>
                </select>
            </div>

            <div>
                Lieu de départ :
                <input type="text" name="lieu" placeholder="Entrez un lieu" value={formData.lieu} onChange={handleChange} />
            </div>

            <div>
                Date de la course :
                <input type="date" name="dateEvent" value={formData.dateEvent} onChange={handleChange} />
            </div>

            <div>
                Heure de début :
                <input type="time" name="heure" value={formData.heure} onChange={handleChange} />
            </div>

            <div>
                Nombre de participants Maximal :
                <input type="text" name="nombreParticipantsMax" value={formData.nombreParticipantsMax} onChange={handleChange} />
            </div>

            <div>
                <input type="submit" value="OK" />
            </div>
            </form>
    </div>
    
  );
}

export default AjoutEvent;
