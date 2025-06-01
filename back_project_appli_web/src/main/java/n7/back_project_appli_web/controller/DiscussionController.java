package n7.back_project_appli_web.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import n7.back_project_appli_web.entity.Discussion;
import n7.back_project_appli_web.repository.DiscussionRepository;
import n7.back_project_appli_web.repository.GroupeAmisRepository;

@RestController
@RequestMapping("/api/discussion")
public class DiscussionController {
    private final DiscussionRepository dr;
    private final GroupeAmisRepository gr;

    public DiscussionController(DiscussionRepository dr, GroupeAmisRepository gr) {
        this.dr = dr;
        this.gr = gr;
    }

    @GetMapping("/")
    public List<Discussion> listDiscussions() {
        return (List<Discussion>) dr.findAll();
    }

    @GetMapping("/groupeamis/{groupeId}")
    public Discussion getDiscussionByGroupe(@PathVariable Long groupeId) {
        return dr.findByGroupeAmisId(groupeId);
    }

    @GetMapping("/{id}")
    public Discussion getDiscussion(@PathVariable Long id) {
        return dr.findById(id).orElse(null);
    }

    @PostMapping("/")
    public Discussion createDiscussion(@RequestBody Discussion d) {
        if (d.getGroupeAmis() != null && d.getGroupeAmis().getId() != null) {
            Long groupeId = d.getGroupeAmis().getId();
            // Vérifie si une discussion existe déjà pour ce groupe
            Discussion existing = dr.findByGroupeAmisId(groupeId);
            if (existing != null) {
                throw new IllegalArgumentException("Une discussion existe déjà pour ce groupe.");
            }
            // Lie le groupe à la discussion
            d.setGroupeAmis(gr.findById(groupeId).orElse(null));
        }
        return dr.save(d);
    }

}
