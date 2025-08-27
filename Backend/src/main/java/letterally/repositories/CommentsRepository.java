package letterally.repositories;

import letterally.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CommentsRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByEssay_Id(Long essayId, Pageable pageable);
    Page<Comment> findByUser_Id(Long userId, Pageable pageable);

    @Query(
            value = """
          SELECT DISTINCT c
          FROM Comment c
          LEFT JOIN FETCH c.user
          LEFT JOIN FETCH c.essay
          """,
            countQuery = "SELECT COUNT(c) FROM Comment c"
    )
    Page<Comment> findAllWithUserAndEssay(Pageable pageable);

    @Query(
            value = """
          SELECT DISTINCT c
          FROM Comment c
          LEFT JOIN FETCH c.user
          LEFT JOIN FETCH c.essay
          WHERE c.essay.id = :essayId
          """,
            countQuery = "SELECT COUNT(c) FROM Comment c WHERE c.essay.id = :essayId"
    )
    Page<Comment> findByEssayIdWithUserAndEssay(Long essayId, Pageable pageable);

    @Query(
            value = """
          SELECT DISTINCT c
          FROM Comment c
          LEFT JOIN FETCH c.user
          LEFT JOIN FETCH c.essay
          WHERE c.user.id = :userId
          """,
            countQuery = "SELECT COUNT(c) FROM Comment c WHERE c.user.id = :userId"
    )
    Page<Comment> findByUserIdWithUserAndEssay(Long userId, Pageable pageable);

    @Query("""
       SELECT c
       FROM Comment c
       LEFT JOIN FETCH c.user
       LEFT JOIN FETCH c.essay
       WHERE c.id = :id
       """)
    Optional<Comment> findByIdWithUserAndEssay(Long id);
}
