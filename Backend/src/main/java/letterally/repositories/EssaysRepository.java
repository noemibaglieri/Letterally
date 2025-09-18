package letterally.repositories;

import letterally.entities.Essay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EssaysRepository extends JpaRepository<Essay, Long> {
    Page<Essay> findByUser_Id(Long userId, Pageable pageable);
    Page<Essay> findByTopic_Id(Long topicId, Pageable pageable);
    long countByUser_Id(Long userId);

    @Query("""
       SELECT e
       FROM Essay e
       LEFT JOIN e.feedback f
       GROUP BY e.id
       ORDER BY COALESCE(AVG(f.value), 0) ASC, e.createdOn DESC
       """)
    Page<Essay> findAllOrderByAverageFeedbackAsc(Pageable pageable);

    Optional<Essay> findTopByTopic_Category_IdOrderByCreatedOnDesc(Long categoryId);

    @Query("""
        SELECT e
        FROM Essay e
        WHERE e.user.id <> :userId
          AND NOT EXISTS (
              SELECT 1 FROM Feedback f
              WHERE f.essay = e
                AND f.user.id = :userId
          )
        """)
    Page<Essay> findNotVotedByUser(@Param("userId") Long userId, Pageable pageable);


    @Query("""
        SELECT e
        FROM Essay e
        LEFT JOIN e.feedback f
        WHERE e.createdOn >= :startOfWeek AND e.createdOn <= :endOfWeek
        GROUP BY e.id
        ORDER BY COALESCE(AVG(f.value), 0) DESC
        """)
    List<Essay> findTop3MostVotedThisWeek(
            @Param("startOfWeek") LocalDateTime startOfWeek,
            @Param("endOfWeek") LocalDateTime endOfWeek,
            Pageable pageable
    );

    boolean existsByUserIdAndTopicId(Long userId, Long topicId);
}

