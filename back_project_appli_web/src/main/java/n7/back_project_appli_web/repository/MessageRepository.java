package n7.back_project_appli_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import n7.back_project_appli_web.entity.Message;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {   
    List<Message> findByDiscussionId(Long discussionId);
}
