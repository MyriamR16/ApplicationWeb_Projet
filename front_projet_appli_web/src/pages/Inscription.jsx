import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Inscription() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        pseudo:'',
        email: '',
        motDePasse: '',
        motDePasseConfirm: '',
    });

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordMessage, setPasswordMessage] = useState('');

    function handleChange (event) {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    function isPasswordStrong(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+=-])[A-Za-z\d@$!%*?&.#^()_+=-]{8,}$/;
        return regex.test(password);
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

        console.log('Envoi du formulaire :', formData);
        navigate('/connexion');
    }

    return (
        <div>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit} method="post" action="Serv">
                <div>
                    Prénom :
                    <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                </div>

                <div>
                    Nom :
                    <input type="text" name="nom" value={formData.nom} onChange={handleChange}  required/>
                </div>

                <div>
                    Pseudo :
                    <input type="text" name="pseudo" value={formData.pseudo} onChange={handleChange}  required/>
                </div>
            
                <div>
                    Email :
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
                </div>


                <div>
                    Mot de passe :
                    <input type="password" name="motDePasse" placeholder="saisir un mot de passe" value={formData.motDePasse} onChange={handleChange} required />
                </div>

                <div>
                    Confirmer le mot de passe :
                    <input type="password" name="motDePasseConfirm" placeholder="saisir un mot de passe" value={formData.motDePasseConfirm} onChange={handleChange} required/>
                </div>

                <div>
                    <input type="hidden" name="op" value="inscription" />
                    <button type="submit">S'inscrire</button>
                </div>
            </form>
        </div>
        
    );
}

export default Inscription;
