package n7.back_project_appli_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import n7.back_project_appli_web.entity.Personne;

public interface PersonneRepository extends JpaRepository<Personne, Long> {
    Personne findByEmail(String email);
    Personne findByPseudo(String pseudo);
}
