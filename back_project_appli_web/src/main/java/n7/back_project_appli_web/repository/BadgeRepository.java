package n7.back_project_appli_web.repository;

import n7.back_project_appli_web.entity.Badge;
import n7.back_project_appli_web.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findByTypeEvent(Event.TypeEvent typeEvent);
}