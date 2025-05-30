package n7.back_project_appli_web.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Forum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
        
    @OneToOne
    private Event event;

    @OneToMany(mappedBy = "forum", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Message> messages = new ArrayList<>();

}
