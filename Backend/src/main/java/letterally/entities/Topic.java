package letterally.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    @Setter(AccessLevel.NONE)
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private LocalDate createdOn;

    private String image;

    public Topic(String title, String description, LocalDate startDate, Category category, String image) {
        this.title = title.trim();
        this.description = description.trim();
        this.startDate = startDate;
        this.category = category;
        this.image = (image == null || image.isBlank()) ? null : image.trim();
    }

    @PrePersist
    public void onCreate() {
        this.createdOn = LocalDate.now();
        if (this.startDate != null) {
            this.endDate = this.startDate.plusDays(7);
        }
    }

    @PreUpdate
    public void onUpdate() {
        if (this.startDate != null) {
            this.endDate = this.startDate.plusDays(7);
        }
    }

}
