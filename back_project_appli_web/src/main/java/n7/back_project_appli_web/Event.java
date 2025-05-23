
package n7.back_project_appli_web;

import jakarta.persistence.*;
import java.time.LocalDate;  
import java.time.LocalTime;


@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomEvent;

    @ManyToOne
    private Personne organisateur;

    private LocalDate date;

    private LocalTime debutHoraire;

    private String lieu;

    private int nombreParticipantsMax;

    private String description;

    private TypeEvent typeEvent;

    private Niveau niveau;

    public enum TypeEvent {
        COURSE_3KM, COURSE_5KM, COURSE_10KM, SEMI_MARATHON, MARATHON, RELAIS, COURSE_A_PIED, COURSE_OBSTACLE, AUTRE
    }

    public enum Niveau {
        DEBUTANT, INTERMEDIAIRE, AVANCE, EXPERT
    }

    // Getters

    public Long getId() {
        return this.id;
    }

    public String getNomEvent() {
        return this.nomEvent;
    }

    public Personne getOrganisateur() {
        return this.organisateur;
    }


    public LocalDate getDate() {
        return this.date;
    }

    public String getLieu() {
        return this.lieu;
    }


    public int getNombreParticipantMax() {
        return this.nombreParticipantsMax;
    }


    public String getDescription() {
        return this.description;
    }
    
    public LocalTime getDebutHoraire() {
        return this.debutHoraire;
    }

    public TypeEvent getTypeEvent() {
        return this.typeEvent;
    }

    public Niveau getNiveau() {
        return this.niveau;
    }

    // SETTERS
    public void setId(Long Id) {
        this.id = Id;
    }

    public void setNomEvent(String NomEvent) {
        this.nomEvent = NomEvent;
    }

    public void setOrganisateur(Personne NouveauOrganisateur) {
        this.organisateur = NouveauOrganisateur;
    }


    public void setDate(LocalDate date1) {
        this.date = date1;
    }

    public void setLieu(String Lieu) {
        this.lieu = Lieu;
    }

    public void setNombreParticipantMax(int NombreParticipantsMax) {
        this.nombreParticipantsMax = NombreParticipantsMax;
    }


    public void setDescription(String Description) {
        this.description = Description;
    }
    
    public void setDebutHoraire(LocalTime DebutHoraire) {
        this.debutHoraire = DebutHoraire;
    }
    
    public void setTypeEvent(TypeEvent typeEvent1) {
        this.typeEvent = typeEvent1;
    }

    public void setNiveau(Niveau niveau1) {
        this.niveau = niveau1;
    }
}
