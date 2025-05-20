
package n7.back_project_appli_web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    PersonneRepository pr;

    @GetMapping("/")
    public List<Personne> listPersonnes() {
        Collection<Personne> personnes = pr.findAll();
        List<Personne> personnesJSON = new ArrayList<>();
        for (Personne personne : personnes) {
            personnesJSON.add(personne);
        }

        return personnesJSON;
    }

    @GetMapping("/{id}")
    public Personne getPersonne(@PathVariable Long id) {
        Personne personne = pr.findById(id).orElse(null);

        return personne;
    }

    @PostMapping("/")
    public void createPersonne(@RequestBody Personne personne) {
        pr.save(personne);
    }

    @PutMapping("/{id}")
    public void updatePersonne(@PathVariable Long id, @RequestBody Personne personne) {
        Personne existingPersonne = pr.findById(id).orElse(null);

        // On vérifie que la personne existe sur la base de données
        if (existingPersonne != null) {
            existingPersonne.setNom(personne.getNom());
            existingPersonne.setPrenom(personne.getPrenom());
            existingPersonne.setPseudo(personne.getPseudo());
            existingPersonne.setEmail(personne.getEmail());
            existingPersonne.setMotDePasse(personne.getMotDePasse());
            pr.save(existingPersonne);
        }
    }

    @DeleteMapping("/{id}")
    public void deletePersonne(@PathVariable Long id) {
        pr.deleteById(id);
    }

    // @PostMapping("/ajoutevent")
    // public void ajoutEvent(
    //         @RequestParam("nomEvent") String nomEvent,
    //         @RequestParam("nombreParticipantsMax") String nombreParticipantsMax,
    //         @RequestParam("lieu") String lieu,
    //         @RequestParam("description") String description,
    //         @RequestParam("dateEvent") String dateEvent,
    //         @RequestParam("heure") String heure,
    //         @RequestParam("nomOrganisateur") String nomOrganisateur,
    //         @RequestParam("choixType") String typeEvent,
    //         @RequestParam("choixNiveau") String niveau) {
    //     Event event = new Event();
    //     event.setNomEvent(nomEvent);
    //     event.setLieu(lieu);
    //     event.setDescription(description);
    //     event.setNombreParticipantMax(Integer.parseInt(nombreParticipantsMax));

    //     LocalDate date = LocalDate.parse(dateEvent);
    //     event.setDate(date);

    //     LocalTime heureDebut = LocalTime.parse(heure);
    //     event.setDebutHorraire(heureDebut);

    //     try {
    //         TypeEvent eventType = TypeEvent.valueOf(typeEvent);
    //         event.setTypeEvent(eventType);
    //     } catch (IllegalArgumentException e) {
    //         System.out.println("Erreur : Type d'événement invalide.");
    //     }

    //     try {
    //         Niveau niveauType = Niveau.valueOf(niveau);
    //         event.setNiveau(niveauType);
    //     } catch (IllegalArgumentException e) {
    //         System.out.println("Erreur : Niveau invalide.");
    //     }

    //     er.save(event);

    // }
}
