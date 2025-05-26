package n7.back_project_appli_web;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ModerateurRepository extends JpaRepository<Moderateur, Long> {
    Moderateur findByPseudo(String pseudo);
}
