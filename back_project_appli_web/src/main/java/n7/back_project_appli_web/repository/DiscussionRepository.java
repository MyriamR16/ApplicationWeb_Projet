package n7.back_project_appli_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import n7.back_project_appli_web.entity.Discussion;

public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    Discussion findByGroupeAmisId(Long groupeId);
}
