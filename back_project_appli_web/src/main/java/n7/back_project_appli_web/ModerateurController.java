package n7.back_project_appli_web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moderateur")
public class ModerateurController {

    @Autowired
    ModerateurRepository mr;

    @Autowired
    EventRepository er;

    @Autowired
    PersonneRepository pr;

    // Récupération de la liste des modérateurs
    @GetMapping("/")
    public List<Moderateur> listModerateurs() {
        Collection<Moderateur> moderateurs = mr.findAll();
        List<Moderateur> moderateursJSON = new ArrayList<>();
        for (Moderateur moderateur : moderateurs) {
            moderateursJSON.add(moderateur);
        }

        return moderateursJSON;
    }

    // Récupération d'un modérateur par son id
    @GetMapping("/{id}")
    public Moderateur getModerateur(@PathVariable Long id) {
        Moderateur moderateur = mr.findById(id).orElse(null);

        return moderateur;
    }

    // Création d'un modérateur
    @PostMapping("/")
    public void createModerateur(@RequestBody Moderateur moderateur) {
        mr.save(moderateur);
    }

    // Mettre à jour un modérateur par son id
    @PutMapping("/{id}")
    public void updateModerateur(@PathVariable Long id, @RequestBody Moderateur moderateur) {
        Moderateur existingModerateur = mr.findById(id).orElse(null);

        // On vérifie que le modérateur existe sur la base de données
        if (existingModerateur != null) {
            existingModerateur.setPseudo(moderateur.getPseudo());
            existingModerateur.setMotDePasse(moderateur.getMotDePasse());
            mr.save(existingModerateur);
        }
    }

    // Suppression d'un modérateur par son id
    @DeleteMapping("/{id}")
    public void deleteModerateur(@PathVariable Long id) {
        mr.deleteById(id);
    }

    // Authentification d'un modérateur
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        Moderateur moderateur = mr.findByPseudo(loginRequest.getEmail());
        if (moderateur == null) {
            return ResponseEntity.status(401).body("Pseudo non trouvé");
        }
        if (!moderateur.getMotDePasse().equals(loginRequest.getMotDePasse())) {
            return ResponseEntity.status(401).body("Mot de passe incorrect");
        }
        return ResponseEntity.ok("Connexion réussie !");
    }

    // Suppression d'un événement
    @DeleteMapping("/event/{id}")
    public ResponseEntity<String> deleteEvenement(@PathVariable Long id) {
        if (er.existsById(id)) {
            er.deleteById(id);
            return ResponseEntity.ok("Événement supprimé avec succès.");
        } else {
            return ResponseEntity.status(404).body("Événement non trouvé.");
        }
    }

    // Suppression d'une personne
    @DeleteMapping("/personne/{id}")
    public ResponseEntity<String> deletePersonne(@PathVariable Long id) {
        if (pr.existsById(id)) {
            pr.deleteById(id);
            return ResponseEntity.ok("Personne supprimée avec succès.");
        } else {
            return ResponseEntity.status(404).body("Personne non trouvée.");
        }
    }
}



