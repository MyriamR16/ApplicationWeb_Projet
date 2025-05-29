package n7.back_project_appli_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import n7.back_project_appli_web.entity.Forum;

public interface ForumRepository extends JpaRepository<Forum, Long> {
    Forum findByEventId(Long eventId);
}
