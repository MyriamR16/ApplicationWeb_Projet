package n7.back_project_appli_web.controller;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import n7.back_project_appli_web.entity.Message;
import n7.back_project_appli_web.repository.MessageRepository;

@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    MessageRepository mr;

    @GetMapping("/forum/{forumId}")
    public List<Message> getMessagesByForum(@PathVariable Long forumId) {
        return mr.findByForumId(forumId);
    }

    @GetMapping("/{id}")
    public Message getMessage(@PathVariable Long forumId, @PathVariable Long id) {
        return mr.findById(id).orElse(null);
    }

    @PostMapping("/")
    public void createMessage(@RequestBody Message message) {
        message.setDateEnvoi(LocalDateTime.now());
        mr.save(message);
    }

    @PutMapping("/{id}")
    public void updateMessage(@PathVariable Long id, @RequestBody Message messageDetails) {
        Message existingMessage = mr.findById(id).orElse(null);
        if (existingMessage != null) {
            existingMessage.setContenu(messageDetails.getContenu());
            existingMessage.setDateEnvoi(LocalDateTime.now());
            existingMessage.setAuteur(messageDetails.getAuteur());
            existingMessage.setForum(messageDetails.getForum());
            mr.save(existingMessage);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id) {
        mr.deleteById(id);
    }
    
}
