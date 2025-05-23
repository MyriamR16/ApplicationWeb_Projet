package n7.back_project_appli_web;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonneRepository extends JpaRepository<Personne, Long> {
    Personne findByEmail(String email);
    Personne findByPseudo(String pseudo);
}
