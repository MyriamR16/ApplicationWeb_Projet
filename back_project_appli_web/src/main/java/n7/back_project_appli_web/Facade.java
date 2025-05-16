
package n7.back_project_appli_web;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import n7.back_project_appli_web.Event.Niveau;
import n7.back_project_appli_web.Event.TypeEvent;

@RestController
@RequestMapping("/")
public class Facade {

    @Autowired
    PersonneRepository pr;
    @Autowired
    EventRepository er;

    @GetMapping("/listeinscritsplateforme")
    public Collection<Personne> listeinscritsplateforme() {
        return pr.findAll();
    }

    @PostMapping("/ajoutevent")
    public void ajoutEvent(        
        @RequestParam("nomEvent") String nomEvent, 
        @RequestParam("nombreParticipantsMax") String nombreParticipantsMax,
        @RequestParam("Lieu") String Lieu,
        @RequestParam("description") String description,
        @RequestParam("dateEvent") String dateEvent, 
        @RequestParam("heure") String heure,
        @RequestParam("nomOrganisateur") String nomOrganisateur,
        @RequestParam("choixType") String typeEvent,
        @RequestParam("choixNiveau") String niveau) {
            Event event = new Event();
            event.setNomEvent(nomEvent); 
            event.setLieu(Lieu); 
            event.setDescription(description);
            event.setNombreParticipantMax(Integer.parseInt(nombreParticipantsMax));
        
            LocalDate date = LocalDate.parse(dateEvent);  
            event.setDate(date); 

            LocalTime heureDebut = LocalTime.parse(heure);  
            event.setDebutHorraire(heureDebut);
            
            try {
                TypeEvent eventType = TypeEvent.valueOf(typeEvent); 
                event.setTypeEvent(eventType);
            } catch (IllegalArgumentException e) {
                System.out.println("Erreur : Type d'événement invalide.");
            }

            try {
                Niveau niveauType = Niveau.valueOf(niveau);  
                event.setNiveau(niveauType); 
            } catch (IllegalArgumentException e) {
                System.out.println("Erreur : Niveau invalide.");
            }

            er.save(event);

        }
}
