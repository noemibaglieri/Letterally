package letterally.controllers;

import letterally.entities.Feedback;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.ValidationException;
import letterally.payloads.*;
import letterally.services.FeedbacksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbacksService feedbacksService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<FeedbackRespDTO> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdOn") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return feedbacksService.findAll(pageable)
                .map(f -> new FeedbackRespDTO(
                        f.getId(),
                        f.getValue(),
                        f.getContent(),
                        new UserRespDTO(
                                f.getUser().getId(),
                                f.getUser().getUsername(),
                                f.getUser().getEmail(),
                                f.getUser().getAvatar(),
                                f.getUser().getRegisteredOn(),
                                f.getUser().getRole() != null ? f.getUser().getRole().getName() : null
                        ),
                        f.getEssay() != null ? new EssaySummaryDTO(f.getEssay().getId(), f.getEssay().getTitle()) : null,
                        f.getCreatedOn(),
                        f.getLastUpdated()
                ));
    }

    @GetMapping("/by-essay/{essayId}")
    public Page<FeedbackRespDTO> getAllByEssay(@PathVariable Long essayId,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "20") int size,
                                               @RequestParam(defaultValue = "createdOn") String sortBy,
                                               @RequestParam(defaultValue = "desc") String direction) {
        return this.feedbacksService.findAllByEssay(essayId, page, size, sortBy, direction)
                .map(f -> new FeedbackRespDTO(
                        f.getId(),
                        f.getValue(),
                        f.getContent(),
                        new UserRespDTO(
                                f.getUser().getId(),
                                f.getUser().getUsername(),
                                f.getUser().getEmail(),
                                f.getUser().getAvatar(),
                                f.getUser().getRegisteredOn(),
                                f.getUser().getRole() != null ? f.getUser().getRole().getName() : null )
                        ,
                        f.getEssay() != null ? new EssaySummaryDTO(f.getEssay().getId(), f.getEssay().getTitle()) : null,
                        f.getCreatedOn(),
                        f.getLastUpdated()
                ));
    }

    @GetMapping("/by-user/{userId}")
    public Page<FeedbackRespDTO> getAllByUser(@PathVariable Long userId,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size,
                                              @RequestParam(defaultValue = "createdOn") String sortBy,
                                              @RequestParam(defaultValue = "desc") String direction) {
        return this.feedbacksService.findAllByUser(userId, page, size, sortBy, direction)
                .map(f -> new FeedbackRespDTO(
                        f.getId(),
                        f.getValue(),
                        f.getContent(),
                        new UserRespDTO(
                                f.getUser().getId(),
                                f.getUser().getUsername(),
                                f.getUser().getEmail(),
                                f.getUser().getAvatar(),
                                f.getUser().getRegisteredOn(),
                                f.getUser().getRole() != null ? f.getUser().getRole().getName() : null )
                        ,
                        f.getEssay() != null ? new EssaySummaryDTO(f.getEssay().getId(), f.getEssay().getTitle()) : null,
                        f.getCreatedOn(),
                        f.getLastUpdated()
                ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FeedbackRespDTO create(@RequestBody @Validated NewFeedbackDTO payload,
                                  BindingResult validationResult,
                                  @AuthenticationPrincipal User currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        if (currentUser == null) throw new BadRequestException("Authentication required");

        Feedback created = this.feedbacksService.save(payload, currentUser);
        return new FeedbackRespDTO(
                created.getId(),
                created.getValue(),
                created.getContent(),
                new UserRespDTO(
                        created.getUser().getId(),
                        created.getUser().getUsername(),
                        created.getUser().getEmail(),
                        created.getUser().getAvatar(),
                        created.getUser().getRegisteredOn(),
                        created.getUser().getRole() != null ? created.getUser().getRole().getName() : null )
                ,
                created.getEssay() != null ? new EssaySummaryDTO(created.getEssay().getId(), created.getEssay().getTitle()) : null,
                created.getCreatedOn(),
                created.getLastUpdated()
        );
    }

    @PatchMapping("/{feedbackId}")
    public FeedbackRespDTO update(@PathVariable Long feedbackId,
                                  @RequestBody @Validated UpdateFeedbackDTO payload,
                                  BindingResult validationResult,
                                  @AuthenticationPrincipal User currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        if (currentUser == null) throw new BadRequestException("Authentication required");

        Feedback existing = this.feedbacksService.findById(feedbackId);
        boolean isOwner = existing.getUser() != null && existing.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() != null && "ADMIN".equalsIgnoreCase(currentUser.getRole().getName());
        if (!isOwner && !isAdmin) throw new BadRequestException("You do not have permissions to modify this resource");

        Feedback updated = this.feedbacksService.update(feedbackId, payload);
        return new FeedbackRespDTO(
                updated.getId(),
                updated.getValue(),
                updated.getContent(),
                new UserRespDTO(
                        updated.getUser().getId(),
                        updated.getUser().getUsername(),
                        updated.getUser().getEmail(),
                        updated.getUser().getAvatar(),
                        updated.getUser().getRegisteredOn(),
                        updated.getUser().getRole() != null ? updated.getUser().getRole().getName() : null )
                ,
                updated.getEssay() != null ? new EssaySummaryDTO(updated.getEssay().getId(), updated.getEssay().getTitle()) : null,
                updated.getCreatedOn(),
                updated.getLastUpdated()
        );
    }

    @DeleteMapping("/{feedbackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long feedbackId,
                       @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) throw new BadRequestException("Authentication required");

        Feedback existing = this.feedbacksService.findById(feedbackId);
        boolean isOwner = existing.getUser() != null && existing.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() != null && "ADMIN".equalsIgnoreCase(currentUser.getRole().getName());
        if (!isOwner && !isAdmin) throw new BadRequestException("You do not have permissions to delete this resource");

        this.feedbacksService.delete(feedbackId);
    }

    @GetMapping("/avg-by-essay/{essayId}")
    public double averageByEssay(@PathVariable Long essayId) {
    return feedbacksService.averageVote(essayId);
    }

    @GetMapping("/avg-by-author/{userId}")
    public double averageByAuthor(@PathVariable Long userId) {
        return feedbacksService.averageByAuthor(userId);
    }
}