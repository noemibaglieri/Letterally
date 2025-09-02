package letterally.repositories;

import letterally.entities.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FeedbacksRepository extends JpaRepository<Feedback, Long> {

    Optional<Feedback> findByUser_IdAndEssay_Id(Long userId, Long essayId);

    long countByEssay_IdAndValueNotNull(Long essayId);

    @Query("select avg(f.value) from Feedback f where f.essay.id = :essayId and f.value is not null")
    Double findAverageByEssayId(@Param("essayId") Long essayId);

    Page<Feedback> findByEssay_IdAndContentNotNull(Long essayId, Pageable pageable);
}
