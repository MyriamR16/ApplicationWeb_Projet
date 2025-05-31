package n7.back_project_appli_web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import n7.back_project_appli_web.entity.Discussion;
import n7.back_project_appli_web.repository.DiscussionRepository;

@RestController
@RequestMapping("/api/discussions")
public class DiscussionController {

    @Autowired
    DiscussionRepository dr;

    @GetMapping("/")
    public List<Discussion> listDiscussions() {
        return (List<Discussion>) dr.findAll();
    }

    @GetMapping("/discussion_event/{eventId}")
    public Discussion getDiscussion(@PathVariable Long eventId) {
        Discussion discussion = dr.findByEventId(eventId);
        return discussion;
    }

    @PostMapping("/")
    public Discussion createDiscussion(@RequestBody Discussion discussion) {
        return dr.save(discussion);
    }

}
