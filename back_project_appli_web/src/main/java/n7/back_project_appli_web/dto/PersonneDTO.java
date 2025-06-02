package n7.back_project_appli_web.dto;

public class PersonneDTO {
    private Long id;
    private String pseudo;
    private String niveau;

    // Constructeur
    public PersonneDTO(Long id, String pseudo, String niveau) {
        this.id = id;
        this.pseudo = pseudo;
        this.niveau = niveau;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }
}