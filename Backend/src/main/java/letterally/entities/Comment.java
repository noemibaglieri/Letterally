package letterally.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Lob
    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "essay_id", nullable = false)
    private Essay essay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_on")
    private LocalDateTime createdOn;

    public Comment(String content, Essay essay, User user) {
        this.content = content.trim();
        this.essay = essay;
        this.user = user;
    }

    @PrePersist
    public void onCreate() {
        this.createdOn = LocalDateTime.now();
    }
}
