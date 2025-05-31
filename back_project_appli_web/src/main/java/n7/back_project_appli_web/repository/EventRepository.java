package n7.back_project_appli_web.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import n7.back_project_appli_web.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByDate(LocalDate date);

    @Query("SELECT e FROM Event e JOIN e.participants p WHERE p.id = :userId")
    List<Event> findAllByParticipantId(@Param("userId") Long userId);
}