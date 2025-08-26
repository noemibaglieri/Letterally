package letterally.controllers;

import letterally.entities.Comment;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.ValidationException;
import letterally.payloads.CommentRespDTO;
import letterally.payloads.NewCommentDTO;
import letterally.payloads.UpdateCommentDTO;
import letterally.services.CommentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
public class CommentsController {

    @Autowired
    private CommentsService commentsService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<CommentRespDTO> getAll(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size,
                                       @RequestParam(defaultValue = "createdOn") String sortBy,
                                       @RequestParam(defaultValue = "desc") String direction) {
        return this.commentsService.findAll(page, size, sortBy, direction)
                .map(comment -> new CommentRespDTO(
                        comment.getId(),
                        comment.getContent(),
                        comment.getEssay().getId(),
                        comment.getUser().getId(),
                        comment.getUser().getUsername(),
                        comment.getCreatedOn()
                ));
    }

    @GetMapping("/{commentId}")
    public CommentRespDTO getById(@PathVariable Long commentId) {
        Comment comment = this.commentsService.findById(commentId);
        return new CommentRespDTO(
                comment.getId(),
                comment.getContent(),
                comment.getEssay().getId(),
                comment.getUser().getId(),
                comment.getUser().getUsername(),
                comment.getCreatedOn()
        );
    }

    @GetMapping("/by-essay/{essayId}")
    public Page<CommentRespDTO> getAllByEssay(@PathVariable Long essayId,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size,
                                              @RequestParam(defaultValue = "createdOn") String sortBy,
                                              @RequestParam(defaultValue = "desc") String direction) {
        return this.commentsService.findAllByEssayId(essayId, page, size, sortBy, direction)
                .map(comment -> new CommentRespDTO(
                        comment.getId(),
                        comment.getContent(),
                        comment.getEssay().getId(),
                        comment.getUser().getId(),
                        comment.getUser().getUsername(),
                        comment.getCreatedOn()
                ));
    }

    @GetMapping("/by-user/{userId}")
    public Page<CommentRespDTO> getAllByUser(@PathVariable Long userId,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size,
                                             @RequestParam(defaultValue = "createdOn") String sortBy,
                                             @RequestParam(defaultValue = "desc") String direction) {
        return this.commentsService.findAllByUserId(userId, page, size, sortBy, direction)
                .map(comment -> new CommentRespDTO(
                        comment.getId(),
                        comment.getContent(),
                        comment.getEssay().getId(),
                        comment.getUser().getId(),
                        comment.getUser().getUsername(),
                        comment.getCreatedOn()
                ));
    }

    @PostMapping
    public CommentRespDTO create(@RequestBody @Validated NewCommentDTO payload,
                                 BindingResult validationResult,
                                 @AuthenticationPrincipal User currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        if (currentUser == null) throw new BadRequestException("Authentication required");

        Comment created = this.commentsService.save(payload, currentUser);
        return new CommentRespDTO(
                created.getId(),
                created.getContent(),
                created.getEssay().getId(),
                created.getUser().getId(),
                created.getUser().getUsername(),
                created.getCreatedOn()
        );
    }

    @PatchMapping("/{commentId}")
    public CommentRespDTO update(@PathVariable Long commentId,
                                     @RequestBody @Validated UpdateCommentDTO payload,
                                     BindingResult validationResult,
                                     @AuthenticationPrincipal User currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        if (currentUser == null) throw new BadRequestException("Authentication required");

        Comment existing = this.commentsService.findById(commentId);
        boolean isOwner = existing.getUser() != null && existing.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() != null && "ADMIN".equalsIgnoreCase(currentUser.getRole().getName());
        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You do not have permissions to modify this resource");
        }

        Comment updated = this.commentsService.update(commentId, payload);
        return new CommentRespDTO(
                updated.getId(),
                updated.getContent(),
                updated.getEssay().getId(),
                updated.getUser().getId(),
                updated.getUser().getUsername(),
                updated.getCreatedOn()
        );
    }

    @DeleteMapping("/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long commentId,
                       @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) throw new BadRequestException("Authentication required");

        Comment existing = this.commentsService.findById(commentId);
        boolean isOwner = existing.getUser() != null && existing.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() != null && "ADMIN".equalsIgnoreCase(currentUser.getRole().getName());
        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You do not have permissions to delete this resource");
        }

        this.commentsService.delete(commentId);
    }

}