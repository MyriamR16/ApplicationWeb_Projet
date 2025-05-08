import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Connexion() {
  const navigate = useNavigate();
  const [valueEmail, setValueEmail] = useState('');
  const [valuePassword, setValuePassword] = useState('');

  function handleEmailChange(event) {
    setValueEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setValuePassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault(); 
    navigate('/accueil');
   }

  return (
    <div>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <div>
          Email :
          <input
            type="email"
            name="email"
            placeholder="saisir votre mail"
            value={valueEmail}
            onChange={handleEmailChange}
            required
          />
        </div>

        <div>
          Mot de passe :
          <input
            type="password"
            name="motdepasse"
            placeholder="saisir un mot de passe"
            value={valuePassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <input type="hidden" name="op" value="connexion" />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Connexion;
