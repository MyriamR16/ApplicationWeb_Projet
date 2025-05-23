package n7.back_project_appli_web;

public class PersonneDTO {
    private String pseudo;
    private String niveau;

    // Constructeur
    public PersonneDTO(String pseudo, String niveau) {
        this.pseudo = pseudo;
        this.niveau = niveau;
    }

    // Getters
    public String getPseudo() {
        return pseudo;
    }

    public String getNiveau() {
        return niveau;
    }
}