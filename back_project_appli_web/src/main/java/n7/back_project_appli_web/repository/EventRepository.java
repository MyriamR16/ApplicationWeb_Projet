package n7.back_project_appli_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import n7.back_project_appli_web.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}