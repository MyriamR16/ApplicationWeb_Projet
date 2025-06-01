package n7.back_project_appli_web.controller;

import java.util.ArrayList;
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

import n7.back_project_appli_web.entity.Discussion;
import n7.back_project_appli_web.entity.GroupeAmis;
import n7.back_project_appli_web.entity.Personne;
import n7.back_project_appli_web.repository.GroupeAmisRepository;
import n7.back_project_appli_web.repository.PersonneRepository;

@RestController
@RequestMapping("/api/groupeamis")
public class GroupeAmisController {

    @Autowired
    private GroupeAmisRepository gr;

    @Autowired
    private PersonneRepository pr;

    @GetMapping("/")
    public List<GroupeAmis> listGroupes() {
        return (List<GroupeAmis>) gr.findAll();
    }

    @GetMapping("/{id}")
    public GroupeAmis getGroupe(@PathVariable Long id) {
        return gr.findById(id).orElse(null);
    }

    @GetMapping("/user/{userId}")
    public List<GroupeAmis> getGroupesByUser(@PathVariable Long userId) {
        List<GroupeAmis> all = (List<GroupeAmis>) gr.findAll();
        List<GroupeAmis> result = new ArrayList<>();
        for (GroupeAmis g : all) {
            if (g.getMembres() != null && g.getMembres().stream().anyMatch(m -> m.getId().equals(userId))) {
                result.add(g);
            }
        }
        return result;
    }

    @PostMapping("/")
    void createGroupe(@RequestBody Map<String, Object> body) {
        String nom = (String) body.get("nom");
        String description = (String) body.get("description");
        Object adminObj = body.get("admin");
        GroupeAmis groupe = new GroupeAmis();
        groupe.setNom(nom);
        groupe.setDescription(description);
        if (adminObj instanceof Map) {
            Object adminIdObj = ((Map<?, ?>) adminObj).get("id");
            if (adminIdObj != null) {
                Long adminId = Long.valueOf(adminIdObj.toString());
                Personne admin = pr.findById(adminId).orElse(null);
                if (admin != null) {
                    groupe.setAdmin(admin);
                    // Ajout automatique de l'admin comme membre
                    ArrayList<Personne> membres = new ArrayList<>();
                    membres.add(admin);
                    groupe.setMembres(membres);
                }
            }
        }
        Discussion discussion = new Discussion();
        discussion.setGroupeAmis(groupe); 
        groupe.setDiscussion(discussion);
        gr.save(groupe);
    }

    @PutMapping("/{id}")
    public void updateGroupe(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        GroupeAmis existingGroupe = gr.findById(id).orElse(null);
        if (existingGroupe != null) {
            if (body.containsKey("nom")) {
                existingGroupe.setNom((String) body.get("nom"));
            }
            if (body.containsKey("description")) {
                existingGroupe.setDescription((String) body.get("description"));
            }
            if (body.containsKey("admin")) {
                Object adminObj = body.get("admin");
                if (adminObj instanceof Map) {
                    Object adminIdObj = ((Map<?, ?>) adminObj).get("id");
                    if (adminIdObj != null) {
                        Long adminId = Long.valueOf(adminIdObj.toString());
                        Personne admin = pr.findById(adminId).orElse(null);
                        if (admin != null) {
                            existingGroupe.setAdmin(admin);
                        }
                    }
                }
            }
            gr.save(existingGroupe);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteGroupe(@PathVariable Long id) {
        gr.deleteById(id);
    }

    @PostMapping("/{groupeId}/ajouterMembre")
    public ResponseEntity<?> ajouterMembre(@PathVariable Long groupeId, @RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        GroupeAmis groupe = gr.findById(groupeId).orElse(null);
        Personne personne = pr.findById(userId).orElse(null);

        if (groupe == null || personne == null) {
            return ResponseEntity.badRequest().body("Groupe ou utilisateur introuvable");
        }

        if (groupe.getMembres().contains(personne)) {
            return ResponseEntity.badRequest().body("L'utilisateur est déjà membre du groupe");
        }

        groupe.getMembres().add(personne);
        gr.save(groupe);

        return ResponseEntity.ok("Ajout au groupe réussi !");
    }

    @PostMapping("/{groupeId}/retirerMembre")
    public ResponseEntity<?> retirerMembre(@PathVariable Long groupeId, @RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        GroupeAmis groupe = gr.findById(groupeId).orElse(null);
        Personne personne = pr.findById(userId).orElse(null);

        if (groupe == null || personne == null) {
            return ResponseEntity.badRequest().body("Groupe ou utilisateur introuvable");
        }

        groupe.getMembres().remove(personne);
        gr.save(groupe);

        return ResponseEntity.ok("Retrait du groupe réussi !");
    }
}
