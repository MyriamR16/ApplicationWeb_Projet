package n7.back_project_appli_web.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //columnDefinition = "TEXT" pour stocker de longs messages
    @Column(unique = true, columnDefinition = "TEXT") 
    private String contenu;

    private LocalDateTime dateEnvoi;

    @ManyToOne
    private Personne auteur;

    @ManyToOne
    @JsonBackReference
    private Forum forum;


}
