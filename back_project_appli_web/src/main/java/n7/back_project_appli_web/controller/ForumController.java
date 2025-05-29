package n7.back_project_appli_web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import n7.back_project_appli_web.entity.Forum;
import n7.back_project_appli_web.repository.ForumRepository;

@RestController
@RequestMapping("/api/forums")
public class ForumController {

    @Autowired
    ForumRepository fr;

    @GetMapping("/")
    public List<Forum> listForums() {
        return (List<Forum>) fr.findAll();
    }

    @GetMapping("/forum_event/{eventId}")
    public Forum getForum(@PathVariable Long eventId) {
        Forum forum = fr.findByEventId(eventId);
        return forum;
    }

    @PostMapping("/")
    public Forum createForum(@RequestBody Forum forum) {
        return fr.save(forum);
    }

}
