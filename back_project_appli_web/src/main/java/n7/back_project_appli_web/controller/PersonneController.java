
package n7.back_project_appli_web.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import n7.back_project_appli_web.dto.PersonneDTO;
import n7.back_project_appli_web.entity.Event;
import n7.back_project_appli_web.entity.Personne;
import n7.back_project_appli_web.repository.EventRepository;
import n7.back_project_appli_web.repository.PersonneRepository;

@RestController
@RequestMapping("/api/user")
public class PersonneController {

    @Autowired
    PersonneRepository pr;

    @Autowired
    EventRepository er;

    @GetMapping("/")
    public List<Personne> listPersonnes() {
        Collection<Personne> personnes = pr.findAll();
        List<Personne> personnesJSON = new ArrayList<>();
        for (Personne personne : personnes) {
            personnesJSON.add(personne);
        }

        return personnesJSON;
    }

    @GetMapping("/list")
    public ResponseEntity<List<PersonneDTO>> listPersonnesSimplified() {
        List<Personne> personnes = pr.findAll();
        List<PersonneDTO> dtos = personnes.stream()
                .map(p -> new PersonneDTO(p.getPseudo(), p.getNiveau()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public Personne getPersonne(@PathVariable Long id) {
        Personne personne = pr.findById(id).orElse(null);
        return personne;
    }

    @PutMapping("/{id}")
    public void updatePersonne(@PathVariable Long id, @RequestBody Personne personne) {
        Personne existingPersonne = pr.findById(id).orElse(null);

        // On vérifie que la personne existe sur la base de données
        if (existingPersonne != null) {
            existingPersonne.setNom(personne.getNom());
            existingPersonne.setPrenom(personne.getPrenom());
            existingPersonne.setNiveau(personne.getNiveau());
            existingPersonne.setPseudo(personne.getPseudo());
            existingPersonne.setEmail(personne.getEmail());
            existingPersonne.setMotDePasse(personne.getMotDePasse());
            existingPersonne.setRole(personne.getRole());
            pr.save(existingPersonne);
        }
    }

    @DeleteMapping("/{id}")
    public void deletePersonne(@PathVariable Long id) {
        Personne personne = pr.findById(id).orElse(null);
        if (personne != null) {
            // Retirer la personne de tous les events où elle est participante
            List<Event> events = er.findAll();
            for (Event event : events) {
                if (event.getParticipants().contains(personne)) {
                    event.getParticipants().remove(personne);
                    er.save(event);
                }
            }
            pr.deleteById(id);
        }
    }

    @GetMapping("/{id}/courses")
    public List<Event> getCoursesByUser(@PathVariable Long id) {
        return er.findAllByParticipantId(id);
    }
}
