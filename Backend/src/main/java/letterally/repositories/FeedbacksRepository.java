package letterally.repositories;

import letterally.entities.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeedbacksRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByUser_Id(Long userId, Pageable pageable);
    Page<Feedback> findByEssay_Id(Long essayId, Pageable pageable);
    long countByEssay_Id(Long essayId);

    @Query("select avg(f.value) from Feedback f where f.essay.id = :essayId")
    Double findAverageByEssayId(@Param("essayId") Long essayId);

    @Query("select avg(f.value) from Feedback f where f.essay.user.id = ?1")
    Double findAverageByAuthorId(Long userId);
}
