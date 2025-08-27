package letterally.repositories;

import letterally.entities.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VotesRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUser_IdAndEssay_Id(Long userId, Long essayId);
    long countByEssay_Id(Long essayId);
    @Query("SELECT AVG(v.value) FROM Vote v WHERE v.essay.id = :essayId")
    Double findAverageByEssayId(Long essayId);

}
