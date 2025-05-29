package n7.back_project_appli_web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import n7.back_project_appli_web.entity.Event;
import n7.back_project_appli_web.repository.EventRepository;

@RestController
@RequestMapping("/api/event")
public class EventController {

    @Autowired
    EventRepository er;

    @GetMapping("/")
    public List<Event> listEvents() {
        // Collection<Event> events = er.findAll();
        // List<Event> eventsJSON = new ArrayList<>();
        // for (Event event : events) {
        //     eventsJSON.add(event);
        // }

        // return eventsJSON;

        return (List<Event>) er.findAll();
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        Event event = er.findById(id).orElse(null);

        return event;
    }

    @PostMapping("/")
    public void createEvent(@RequestBody Event event) {
        er.save(event);
    }

    @PutMapping("/{id}")
    public void updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event existingEvent = er.findById(id).orElse(null);
        if (existingEvent != null) {
            existingEvent.setNomEvent(eventDetails.getNomEvent());
            existingEvent.setOrganisateur(eventDetails.getOrganisateur());
            existingEvent.setDescription(eventDetails.getDescription());
            existingEvent.setNiveau(eventDetails.getNiveau());
            existingEvent.setTypeEvent(eventDetails.getTypeEvent());
            existingEvent.setLieu(eventDetails.getLieu());
            existingEvent.setDate(eventDetails.getDate());
            existingEvent.setDebutHoraire(eventDetails.getDebutHoraire());
            existingEvent.setNombreParticipantMax(eventDetails.getNombreParticipantMax());
            er.save(existingEvent);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        er.deleteById(id);
    }

}
