
package n7.back_project_appli_web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    PersonneRepository pr;

    @Autowired

    private JwtTokenProvider jwtTokenProvider;

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

    @PostMapping("/")

    public ResponseEntity<?> createPersonne(@RequestBody Personne personne) {
        try {
            pr.save(personne);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Erreur lors de la création de l'utilisateur : " + e.getMessage());
        }
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
            pr.save(existingPersonne);
        }
    }

    @DeleteMapping("/{id}")
    public void deletePersonne(@PathVariable Long id) {
        pr.deleteById(id);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Personne personne = pr.findByEmail(loginRequest.getEmail());
        if (personne == null || !personne.getMotDePasse().equals(loginRequest.getMotDePasse())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtTokenProvider.createToken(personne.getEmail(), personne.getId());
        return ResponseEntity.ok(Map.of("token", token));
    }
    
}
