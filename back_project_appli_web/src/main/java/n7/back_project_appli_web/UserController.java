
package n7.back_project_appli_web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        Personne personne = pr.findByEmail(loginRequest.getEmail());
        if (personne == null) {
            return ResponseEntity.status(401).body("Email non trouvé");
        }
        if (!personne.getMotDePasse().equals(loginRequest.getMotDePasse())) {
            return ResponseEntity.status(401).body("Mot de passe incorrect");
        }
        return ResponseEntity.ok("Connexion réussie !");
    }

    
}
