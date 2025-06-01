package n7.back_project_appli_web.entity;

import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class GroupeAmis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String description;

    @ManyToMany
    @JoinTable(
        name = "groupe_amis_personne",
        joinColumns = @JoinColumn(name = "groupe_amis_id"),
        inverseJoinColumns = @JoinColumn(name = "personne_id")
    )
    private Collection<Personne> membres;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Personne admin;

    @OneToOne(mappedBy = "groupeAmis", cascade = CascadeType.ALL)
    @JsonBackReference
    private Discussion discussion;


}
