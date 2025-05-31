package n7.back_project_appli_web.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import n7.back_project_appli_web.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByDate(LocalDate date);
}