package n7.back_project_appli_web.dto;

public class PersonneDTO {
    private final String pseudo;
    private final String niveau;

    // Constructeur
    public PersonneDTO(String pseudo, String niveau) {
        this.pseudo = pseudo;
        this.niveau = niveau;
    }

    // Getters
    public String getPseudo() {
        return this.pseudo;
    }

    public String getNiveau() {
        return this.niveau;
    }
}