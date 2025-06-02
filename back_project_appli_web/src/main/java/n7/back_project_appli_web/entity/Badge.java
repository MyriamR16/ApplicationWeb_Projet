package n7.back_project_appli_web.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom; 
    private String description;
    private String imageUrl; 

    @Enumerated(EnumType.STRING)
    private Event.TypeEvent typeEvent;
}