package letterally.repositories;

import letterally.entities.Essay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}
