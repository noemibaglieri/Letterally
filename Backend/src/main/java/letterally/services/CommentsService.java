package letterally.services;

import letterally.entities.Comment;
import letterally.entities.Essay;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.NotFoundException;
import letterally.payloads.NewCommentDTO;
import letterally.payloads.UpdateCommentDTO;
import letterally.repositories.CommentsRepository;
import letterally.repositories.EssaysRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CommentsService {

    @Autowired
    private CommentsRepository commentsRepository;

    @Autowired
    private EssaysRepository essaysRepository;

    public Comment save(NewCommentDTO payload, User author) {
        Essay essay = this.essaysRepository.findById(payload.essayId())
                .orElseThrow(() -> new NotFoundException("Essay with id * " + payload.essayId() + " * not found"));

        String content = payload.content().trim();
        if (content.isBlank()) throw new BadRequestException("Comment content must not be blank");

        Comment comment = new Comment(content, essay, author);
        return this.commentsRepository.save(comment);
    }

    public Comment update(Long id, UpdateCommentDTO payload) {
        Comment found = this.commentsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Comment with id * " + id + " * not found"));

        String content = payload.content().trim();
        if (content.isBlank()) throw new BadRequestException("Comment content must not be blank");

        found.setContent(content);
        return this.commentsRepository.save(found);
    }

    public void delete(Long id) {
        Comment found = this.commentsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Comment with id * " + id + " * not found"));
        this.commentsRepository.delete(found);
    }

    public Comment findById(Long id) {
        return commentsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Comment with id * " + id + " * not found"));
    }

    public Page<Comment> findAllByEssayId(Long essayId, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return commentsRepository.findByEssay_Id(essayId, pageable);
    }

    public Page<Comment> findAllByUserId(Long userId, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return commentsRepository.findByUser_Id(userId, pageable);
    }

    public Page<Comment> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return commentsRepository.findAll(pageable);
    }
}
