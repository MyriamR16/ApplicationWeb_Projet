package n7.back_project_appli_web;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


@RestController
@RequestMapping("/api/event")
public class EventController {

    @Autowired
    EventRepository er;
    @Autowired
    PersonneRepository pr;

    @GetMapping("/")
    public List<Event> listEvents() {
        // Collection<Event> events = er.findAll();
        // List<Event> eventsJSON = new ArrayList<>();
        // for (Event event : events) {
        //     eventsJSON.add(event);
        // }

        // return eventsJSON;

        return (List<Event>) er.findAll();
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        Event event = er.findById(id).orElse(null);

        return event;
    }

    // @PostMapping("/")
    // public void createEvent(@RequestBody Event event) {
    //     er.save(event);
    // }

    @PostMapping("/")
    public ResponseEntity<?> createEvent(@RequestBody Event event, @AuthenticationPrincipal Jwt principal) {
            
        try {

            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non authentifié");
            }
            // Récupérer l'ID de l'utilisateur connecté
            String userId = principal.getSubject(); // ou getClaim("sub")

            // Récupérer l'objet User depuis la BDD
            Optional<Personne> userOpt = pr.findById(Long.parseLong(userId));
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non trouvé");
            }

            Personne user = userOpt.get();

            // Associer le user comme organisateur
            event.setOrganisateur(user);

            Event savedEvent = er.save(event);
            return ResponseEntity.ok(savedEvent);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public void updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event existingEvent = er.findById(id).orElse(null);
        if (existingEvent != null) {
            existingEvent.setNomEvent(eventDetails.getNomEvent());
            existingEvent.setOrganisateur(eventDetails.getOrganisateur());
            existingEvent.setDescription(eventDetails.getDescription());
            existingEvent.setNiveau(eventDetails.getNiveau());
            existingEvent.setTypeEvent(eventDetails.getTypeEvent());
            existingEvent.setLieu(eventDetails.getLieu());
            existingEvent.setDate(eventDetails.getDate());
            existingEvent.setDebutHoraire(eventDetails.getDebutHoraire());
            existingEvent.setNombreParticipantMax(eventDetails.getNombreParticipantMax());
            er.save(existingEvent);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        er.deleteById(id);
    }

}
