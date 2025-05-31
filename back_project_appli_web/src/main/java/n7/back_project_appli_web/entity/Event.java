
package n7.back_project_appli_web.entity;

import java.time.LocalDate;  
import java.time.LocalTime;
import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomEvent;

    //@ManyToMany
    private String nomOrganisateur;

    private LocalDate date;

    private LocalTime debutHoraire;

    private String lieu;

    private int nombreParticipantsMax;

    private String description;

    private TypeEvent typeEvent;

    private Niveau niveau;

    @ManyToMany
    @JoinTable(
        name = "personne_event",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "personne_id")
    )    
    private Collection<Personne> participants;

    public enum TypeEvent {
        COURSE_3KM, COURSE_5KM, COURSE_10KM, SEMI_MARATHON, MARATHON, RELAIS, COURSE_A_PIED, COURSE_OBSTACLE, AUTRE
    }

    public enum Niveau {
        DEBUTANT, INTERMEDIAIRE, AVANCE, EXPERT
    }
}
