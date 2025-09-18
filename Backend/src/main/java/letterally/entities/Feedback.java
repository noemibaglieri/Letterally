package letterally.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "feedbacks",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "essay_id"})
)
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"essay","user"})
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Feedback {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(nullable = false)
    private int value;

    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "essay_id", nullable = false)
    @Setter(AccessLevel.NONE)
    private Essay essay;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @Setter(AccessLevel.NONE)
    private User user;

    @Column(name = "created_on", nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime createdOn;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public Feedback(int value, String content, Essay essay, User user) {
        this.value = value;
        this.content = content;
        this.essay = essay;
        this.user = user;
    }

    @PrePersist
    void onCreate() {
        this.createdOn = LocalDateTime.now();
        this.lastUpdated = this.createdOn;
    }

    @PreUpdate
    void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}