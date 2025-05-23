
package n7.back_project_appli_web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    PersonneRepository pr;

    @Autowired
    private PasswordEncoder passwordEncoder;


    private final String SECRET_KEY = "u8V2M6+Y3x7NfE+qgQs7J3N4V1R6O2lkd9XqGZyxhPg=";

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
        // Hacher le mot de passe avant sauvegarde
        personne.setMotDePasse(passwordEncoder.encode(personne.getMotDePasse()));
        Personne savedPersonne = pr.save(personne);
        return ResponseEntity.ok(savedPersonne);
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
        System.out.println("Token reçu");
        Personne personne = pr.findByEmail(loginRequest.getEmail());
        if (personne == null) {
            return ResponseEntity.status(401).body("Email non trouvé");
        }
        
        // Vérifier le mot de passe haché
        if (!passwordEncoder.matches(loginRequest.getMotDePasse(), personne.getMotDePasse())) {
            return ResponseEntity.status(401).body("Mot de passe incorrect");
        }

        // Création du token JWT
        String token = Jwts.builder()
                .setSubject(personne.getEmail())
                .claim("id", personne.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 heures de validité
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();

        // Retourner le token dans le corps de la réponse
        return ResponseEntity.ok(new AuthResponse(token));
    }

    
}
