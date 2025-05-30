package n7.back_project_appli_web.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import n7.back_project_appli_web.entity.Event;
import n7.back_project_appli_web.entity.Personne;
import n7.back_project_appli_web.repository.EventRepository;
import n7.back_project_appli_web.repository.PersonneRepository;

@RestController
@RequestMapping("/api/event")
public class EventController {

    @Autowired
    private EventRepository er;

    @Autowired
    private PersonneRepository personneRepository;


    @GetMapping("/")
    public List<Event> listEvents() {
        return (List<Event>) er.findAll();
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        Event event = er.findById(id).orElse(null);

        return event;
    }

    @PostMapping("/")
    public void createEvent(@RequestBody Event event) {
        er.save(event);
    }

    @PutMapping("/{id}")
    public void updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event existingEvent = er.findById(id).orElse(null);
        if (existingEvent != null) {
            existingEvent.setNomEvent(eventDetails.getNomEvent());
            existingEvent.setNomOrganisateur(eventDetails.getNomOrganisateur());
            existingEvent.setDescription(eventDetails.getDescription());
            existingEvent.setNiveau(eventDetails.getNiveau());
            existingEvent.setTypeEvent(eventDetails.getTypeEvent());
            existingEvent.setLieu(eventDetails.getLieu());
            existingEvent.setDate(eventDetails.getDate());
            existingEvent.setDebutHoraire(eventDetails.getDebutHoraire());
            existingEvent.setNombreParticipantsMax(eventDetails.getNombreParticipantsMax());
            er.save(existingEvent);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        er.deleteById(id);
    }

    @PostMapping("/{eventId}/participer")
    public ResponseEntity<?> participer(@PathVariable Long eventId, @RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Event event = er.findById(eventId).orElse(null);
        Personne personne = personneRepository.findById(userId).orElse(null);

        if (event == null || personne == null) {
            return ResponseEntity.badRequest().body("Event ou utilisateur introuvable");
        }

        event.getParticipants().add(personne);
        er.save(event);

        return ResponseEntity.ok("Inscription réussie !");
    }

}
