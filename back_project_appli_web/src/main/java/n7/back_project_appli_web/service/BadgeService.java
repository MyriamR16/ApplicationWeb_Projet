package n7.back_project_appli_web.service;

import lombok.RequiredArgsConstructor;
import n7.back_project_appli_web.entity.Badge;
import n7.back_project_appli_web.entity.Event;
import n7.back_project_appli_web.entity.Personne;
import n7.back_project_appli_web.repository.BadgeRepository;
import n7.back_project_appli_web.repository.PersonneRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BadgeService {
    private final BadgeRepository badgeRepository;
    private final PersonneRepository personneRepository;

    public void attribuerBadgeSiPremier(Event.TypeEvent typeEvent, Personne personne) {
        boolean dejaBadge = personne.getBadges().stream()
            .anyMatch(b -> b.getTypeEvent() == typeEvent);
        if (!dejaBadge) {
            badgeRepository.findByTypeEvent(typeEvent).ifPresent(badge -> {
                personne.getBadges().add(badge);
                personneRepository.save(personne);
            });
        }
    }
}