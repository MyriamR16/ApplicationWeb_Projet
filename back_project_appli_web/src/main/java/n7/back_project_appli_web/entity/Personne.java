package n7.back_project_appli_web.entity;

import java.util.ArrayList;
import java.util.Collection;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "personne")
@Data
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

    private String role;

    @ManyToMany(mappedBy = "participants")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Collection<Event> events = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "personne_badge", joinColumns = @JoinColumn(name = "personne_id"), inverseJoinColumns = @JoinColumn(name = "badge_id"))
    private Collection<Badge> badges = new ArrayList<>();

    public Personne(String nom, String prenom, String pseudo, String email, String motDePasse) {
        this.nom = nom;
        this.prenom = prenom;
        this.pseudo = pseudo;
        this.email = email;
        this.motDePasse = motDePasse;
    }

    // Collection<Evenement> historiqueEvenements;
    // Collection<Evenement> evenementsFavoris;
    // Collection<Evenement> evenementsInscrit;
    // localisation (Geolocation API de Google Maps)
    // pas quotidiens (api:
    // https://developer.mozilla.org/fr/docs/Web/API/Geolocation_API)
    // Collection<Personne> amis;
    // Collection<Personne> demandesAmis;
    // photo de profil (avatar generator par défaut: dicebear)
    // anniversaire;
    // sexe;
    // bool compte verifié;
    // score;
    // niveau course;
    // Collection<Notification> notifications;
    // Collection<Notification> notificationsNonLues;
    // Collection<Badge> badges;

    // int flamme; //nombre de jours consécutifs de connexion
    // objectif journalier
    // suivi des objectifs (tracker, selon la difficulté de l'objectif)

    /* Get et set Id */

}
