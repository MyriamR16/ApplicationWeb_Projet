package n7.back_project_appli_web.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

// import java.util.Collection;
@Entity
@Table(name = "personne")
public class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
   
	private String nom;
	private String prenom;

    @Column(unique = true)
    private String pseudo; // pseudo unique

    @Column(unique = true)
    private String email;

    private String niveau; // "DEBUTANT", "INTERMEDIAIRE", etc.

    @Transient
    private String motDePasseNonHache; // Ne sera pas persisté en base

    @Column(name = "mot_de_passe")
    private String motDePasse; // Stockera le mot de passe haché
        
    public Personne() {
        }

    public Personne(String nom, String prenom, String pseudo, String email, String motDePasse) {
        this.nom = nom;
        this.prenom = prenom;
        this.pseudo = pseudo;
        this.email = email;
        this.motDePasse = motDePasse;
    }

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
    
    /* Get et set Id  */
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    /* Get et set Niveau */
    public String getNiveau() {
        return niveau;
    }
    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }
    /* Get et set Nom */
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    /* Get et set Prenom */
    public String getPrenom() {
        return prenom;
    } 
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    /* Get et set Pseudo */
    public String getPseudo() {
        return this.pseudo;
    }
    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }
    /* Get et set Email */
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    /* Get et set MotDePasse */
    public String getMotDePasse() {
        return motDePasse;
    }
    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Personne personne = (Personne) o;
        return id != null && id.equals(personne.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
    
    @Override
    public String toString() {
        return "Personne{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", pseudo='" + pseudo + '\'' +
                ", email='" + email + '\'' +
                '}';
    }



}
