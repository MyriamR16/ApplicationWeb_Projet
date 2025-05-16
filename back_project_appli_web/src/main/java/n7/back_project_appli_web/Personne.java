package n7.back_project_appli_web;

import jakarta.persistence.*;

// import java.util.Collection;
@Entity
public class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

	String nom;
	String prenom;
    String pseudoUnique;
    String email;
    String mot_de_passe; // mot de passe crypté !!!

    //Collection<Evenement> historiqueEvenements;
    //Collection<Evenement> evenementsFavoris;
    //Collection<Evenement> evenementsInscrit;
    // localisation (Geolocation API de Google Maps)
    // pas quotidiens (api: https://developer.mozilla.org/fr/docs/Web/API/Geolocation_API)
    //Collection<Personne> amis;
    //Collection<Personne> demandesAmis;
    // photo de profil (avatar generator par défaut: dicebear)
    // anniversaire;
    // sexe;
    // bool compte verifié;
    // score;
    // niveau course;
    //Collection<Notification> notifications;
    //Collection<Notification> notificationsNonLues;
    //Collection<Badge> badges;

    //int flamme; //nombre de jours consécutifs de connexion
    //objectif journalier
    //suivi des objectifs (tracker, selon la difficulté de l'objectif)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    } 
    
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getPseudo() {
        return this.pseudoUnique;
    }

    public void setPseudo(String pseudo) {
        this.pseudoUnique = pseudo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMot_de_passe() {
        return mot_de_passe;
    }

    public void setMot_de_passe(String mot_de_passe) {
        this.mot_de_passe = mot_de_passe;
    }

}
