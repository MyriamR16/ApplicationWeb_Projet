package n7.back_project_appli_web.service;

import n7.back_project_appli_web.entity.Event;
import n7.back_project_appli_web.entity.Personne;
import n7.back_project_appli_web.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EmailService emailService;

    // Exécuté tous les jours à 8h
    @Scheduled(cron = "0 */2 * * * *")
    public void sendReminders() {
        LocalDate tomorrow = LocalDate.now();
        List<Event> events = eventRepository.findByDate(tomorrow);

        for (Event event : events) {
            for (Personne participant : event.getParticipants()) {
                String subject = "Rappel : Course demain !";
                String text = "Bonjour " + participant.getPrenom() + ",\n\n"
                        + "Petit rappel : vous participez à la course '" + event.getNomEvent()
                        + "' demain à " + event.getLieu() + ".\nBonne préparation !";
                emailService.sendSimpleMessage(participant.getEmail(), subject, text);
            }
        }
    }
}