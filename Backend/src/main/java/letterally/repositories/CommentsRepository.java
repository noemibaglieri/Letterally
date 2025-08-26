package letterally.repositories;

import letterally.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentsRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByEssay_Id(Long essayId, Pageable pageable);
    Page<Comment> findByUser_Id(Long userId, Pageable pageable);
}
