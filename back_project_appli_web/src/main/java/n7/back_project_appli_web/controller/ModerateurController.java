package n7.back_project_appli_web.controller;

import n7.back_project_appli_web.entity.Personne;
import n7.back_project_appli_web.entity.Event;
import n7.back_project_appli_web.repository.PersonneRepository;
import n7.back_project_appli_web.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moderateur")
public class ModerateurController {

    @Autowired
    private PersonneRepository personneRepository;

    @Autowired
    private EventRepository eventRepository;

    // Supprimer un utilisateur
    @DeleteMapping("/personne/{id}")
    @PreAuthorize("hasRole('MODERATEUR')")
    public ResponseEntity<?> deletePersonne(@PathVariable Long id) {
        Personne personne = personneRepository.findById(id).orElse(null);
        if (personne != null) {
            // Retirer la personne de tous les events où elle est participante
            for (Event event : eventRepository.findAll()) {
                if (event.getParticipants().contains(personne)) {
                    event.getParticipants().remove(personne);
                    eventRepository.save(event);
                }
            }
            personneRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Supprimer une course
    @DeleteMapping("/event/{id}")
    @PreAuthorize("hasRole('MODERATEUR')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}