package letterally.controllers;

import letterally.entities.Essay;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.ValidationException;
import letterally.payloads.*;
import letterally.services.EssaysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/essays")
public class EssaysController {

    @Autowired
    private EssaysService essaysService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<EssayRespDTO> getAll(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "20") int size,
                                     @RequestParam(defaultValue = "createdOn") String sortBy,
                                     @RequestParam(defaultValue = "desc") String direction) {
        Page<Essay> result = essaysService.findAll(page, size, sortBy, direction);

        Page<EssayRespDTO> mapped = result.map((Essay e) -> {
            List<FeedbackRespDTO> feedback = e.getFeedback().stream()
                    .map(f -> new FeedbackRespDTO(
                            f.getId(),
                            f.getValue(),
                            f.getContent(),
                            (f.getUser() != null
                                    ? new UserRespDTO(
                                    f.getUser().getId(),
                                    f.getUser().getUsername(),
                                    f.getUser().getEmail(),
                                    f.getUser().getAvatar(),
                                    f.getUser().getRegisteredOn(),
                                    e.getUser().getRole() != null ? e.getUser().getRole().getName() : null
                            )
                                    : null),
                            f.getCreatedOn(),
                            f.getLastUpdated()
                    )).toList();

            return new EssayRespDTO(
                    e.getId(),
                    e.getTitle(),
                    e.getContent(),
                    e.getCreatedOn(),
                    e.getLastUpdated(),
                    e.getImage(),
                    e.getTopic() != null
                            ? new TopicRespDTO(
                            e.getTopic().getId(),
                            e.getTopic().getTitle(),
                            e.getTopic().getDescription(),
                            e.getTopic().getEndDate() != null ? e.getTopic().getEndDate().toString() : null,
                            e.getTopic().getImage(),
                            e.getTopic().getCategory() != null
                                    ? new CategoryRespDTO(
                                    e.getTopic().getCategory().getId(),
                                    e.getTopic().getCategory().getName(),
                                    e.getTopic().getCategory().getColor(),
                                    e.getTopic().getCategory().getIcon()
                            )
                                    : null,
                            e.getTopic().getCategory() != null ? e.getTopic().getCategory().getId() : null
                    )
                            : null,
                    (e.getUser() != null
                            ? new UserRespDTO(
                            e.getUser().getId(),
                            e.getUser().getUsername(),
                            e.getUser().getEmail(),
                            e.getUser().getAvatar(),
                            e.getUser().getRegisteredOn(),
                            e.getUser().getRole() != null ? e.getUser().getRole().getName() : null )
                            : null),
                    feedback
            );
        });

        return mapped;
    }

    @GetMapping("/{id}")
    public EssayRespDTO getById(@PathVariable Long id) {
        Essay e = essaysService.findById(id);

        List<FeedbackRespDTO> feedback = e.getFeedback().stream()
                .map(f -> new FeedbackRespDTO(
                        f.getId(),
                        f.getValue(),
                        f.getContent(),
                        (f.getUser() != null
                                ? new UserRespDTO(
                                f.getUser().getId(),
                                f.getUser().getUsername(),
                                f.getUser().getEmail(),
                                f.getUser().getAvatar(),
                                f.getUser().getRegisteredOn(),
                                e.getUser().getRole() != null ? e.getUser().getRole().getName() : null )

                                : null),
                        f.getCreatedOn(),
                        f.getLastUpdated()
                ))
                .toList();

        return new EssayRespDTO(
                e.getId(),
                e.getTitle(),
                e.getContent(),
                e.getCreatedOn(),
                e.getLastUpdated(),
                e.getImage(),
                e.getTopic() != null
                        ? new TopicRespDTO(
                        e.getTopic().getId(),
                        e.getTopic().getTitle(),
                        e.getTopic().getDescription(),
                        e.getTopic().getEndDate().toString(),
                        e.getTopic().getImage(),
                        e.getTopic().getCategory() != null
                                ? new CategoryRespDTO(
                                e.getTopic().getCategory().getId(),
                                e.getTopic().getCategory().getName(),
                                e.getTopic().getCategory().getColor(),
                                e.getTopic().getCategory().getIcon()
                        )
                                : null,
                        e.getTopic().getCategory() != null
                                ? e.getTopic().getCategory().getId()
                                : null
                )
                        : null,
                (e.getUser() != null
                        ? new UserRespDTO(
                        e.getUser().getId(),
                        e.getUser().getUsername(),
                        e.getUser().getEmail(),
                        e.getUser().getAvatar(),
                        e.getUser().getRegisteredOn(),
                        e.getUser().getRole() != null ? e.getUser().getRole().getName() : null )

                        : null),
                feedback
        );
    }

    @GetMapping("/by-user/{userId}")
    public Page<EssayRespDTO> getAllByUserId(@PathVariable Long userId,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size,
                                             @RequestParam(defaultValue = "createdOn") String sortBy,
                                             @RequestParam(defaultValue = "desc") String direction) {
        Page<Essay> result = this.essaysService.findAllByUserId(userId, page, size, sortBy, direction);

        return result.map((Essay e) -> {

            List<FeedbackRespDTO> feedback = e.getFeedback().stream()
                    .map(f -> new FeedbackRespDTO(
                            f.getId(),
                            f.getValue(),
                            f.getContent(),
                            (f.getUser() != null
                                    ? new UserRespDTO(
                                    f.getUser().getId(),
                                    f.getUser().getUsername(),
                                    f.getUser().getEmail(),
                                    f.getUser().getAvatar(),
                                    f.getUser().getRegisteredOn(),
                                    e.getUser().getRole() != null ? e.getUser().getRole().getName() : null )

                                    : null),
                            f.getCreatedOn(),
                            f.getLastUpdated()
                    ))
                    .toList();

            return new EssayRespDTO(
                    e.getId(),
                    e.getTitle(),
                    e.getContent(),
                    e.getCreatedOn(),
                    e.getLastUpdated(),
                    e.getImage(),
                    e.getTopic() != null
                            ? new TopicRespDTO(
                            e.getTopic().getId(),
                            e.getTopic().getTitle(),
                            e.getTopic().getDescription(),
                            e.getTopic().getEndDate().toString(),
                            e.getTopic().getImage(),
                            e.getTopic().getCategory() != null
                                    ? new CategoryRespDTO(
                                    e.getTopic().getCategory().getId(),
                                    e.getTopic().getCategory().getName(),
                                    e.getTopic().getCategory().getColor(),
                                    e.getTopic().getCategory().getIcon()
                            )
                                    : null,
                            e.getTopic().getCategory() != null ? e.getTopic().getCategory().getId() : null
                    )
                            : null,
                    (e.getUser() != null
                            ? new UserRespDTO(
                            e.getUser().getId(),
                            e.getUser().getUsername(),
                            e.getUser().getEmail(),
                            e.getUser().getAvatar(),
                            e.getUser().getRegisteredOn(),
                            e.getUser().getRole() != null ? e.getUser().getRole().getName() : null )

                            : null),
                    feedback
            );
        });
    }

    @GetMapping("/by-topic/{topicId}")
    public Page<EssayRespDTO> getAllByTopicId(@PathVariable Long topicId,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size,
                                              @RequestParam(defaultValue = "createdOn") String sortBy,
                                              @RequestParam(defaultValue = "desc") String direction) {
        Page<Essay> result = this.essaysService.findAllByTopicId(topicId, page, size, sortBy, direction);

        return result.map((Essay e) -> {

            List<FeedbackRespDTO> feedback = e.getFeedback().stream()
                    .map(f -> new FeedbackRespDTO(
                            f.getId(),
                            f.getValue(),
                            f.getContent(),
                            (f.getUser() != null
                                    ? new UserRespDTO(
                                    f.getUser().getId(),
                                    f.getUser().getUsername(),
                                    f.getUser().getEmail(),
                                    f.getUser().getAvatar(),
                                    f.getUser().getRegisteredOn(),
                                    e.getUser().getRole() != null ? e.getUser().getRole().getName() : null )
                                    : null),
                            f.getCreatedOn(),
                            f.getLastUpdated()
                    ))
                    .toList();

            return new EssayRespDTO(
                    e.getId(),
                    e.getTitle(),
                    e.getContent(),
                    e.getCreatedOn(),
                    e.getLastUpdated(),
                    e.getImage(),
                    e.getTopic() != null
                            ? new TopicRespDTO(
                            e.getTopic().getId(),
                            e.getTopic().getTitle(),
                            e.getTopic().getDescription(),
                            e.getTopic().getEndDate().toString(),
                            e.getTopic().getImage(),
                            e.getTopic().getCategory() != null
                                    ? new CategoryRespDTO(
                                    e.getTopic().getCategory().getId(),
                                    e.getTopic().getCategory().getName(),
                                    e.getTopic().getCategory().getColor(),
                                    e.getTopic().getCategory().getIcon()
                            )
                                    : null,
                            e.getTopic().getCategory() != null ? e.getTopic().getCategory().getId() : null
                    )
                            : null,
                    (e.getUser() != null
                            ? new UserRespDTO(
                            e.getUser().getId(),
                            e.getUser().getUsername(),
                            e.getUser().getEmail(),
                            e.getUser().getAvatar(),
                            e.getUser().getRegisteredOn(),
                            e.getUser().getRole() != null ? e.getUser().getRole().getName() : null )

                            : null),
                    feedback
            );
        });
    }

    @GetMapping("/ordered-by-votes-asc")
    public Page<EssayRespDTO> getOrderedByVotesAsc(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        Page<Essay> result = this.essaysService.findAllOrderByVotesAsc(page, size);

        return result.map((Essay e) -> {
            List<FeedbackRespDTO> feedback = e.getFeedback().stream()
                    .map(f -> new FeedbackRespDTO(
                            f.getId(),
                            f.getValue(),
                            f.getContent(),
                            (f.getUser() != null
                                    ? new UserRespDTO(
                                    f.getUser().getId(),
                                    f.getUser().getUsername(),
                                    f.getUser().getEmail(),
                                    f.getUser().getAvatar(),
                                    f.getUser().getRegisteredOn(),
                                    e.getUser().getRole() != null ? e.getUser().getRole().getName() : null )

                                    : null),
                            f.getCreatedOn(),
                            f.getLastUpdated()
                    ))
                    .toList();

            return new EssayRespDTO(
                    e.getId(),
                    e.getTitle(),
                    e.getContent(),
                    e.getCreatedOn(),
                    e.getLastUpdated(),
                    e.getImage(),
                    e.getTopic() != null
                            ? new TopicRespDTO(
                            e.getTopic().getId(),
                            e.getTopic().getTitle(),
                            e.getTopic().getDescription(),
                            e.getTopic().getEndDate().toString(),
                            e.getTopic().getImage(),
                            e.getTopic().getCategory() != null
                                    ? new CategoryRespDTO(
                                    e.getTopic().getCategory().getId(),
                                    e.getTopic().getCategory().getName(),
                                    e.getTopic().getCategory().getColor(),
                                    e.getTopic().getCategory().getIcon()
                            )
                                    : null,
                            e.getTopic().getCategory() != null ? e.getTopic().getCategory().getId() : null
                    )
                            : null,
                    (e.getUser() != null
                            ? new UserRespDTO(
                            e.getUser().getId(),
                            e.getUser().getUsername(),
                            e.getUser().getEmail(),
                            e.getUser().getAvatar(),
                            e.getUser().getRegisteredOn(),
                            e.getUser().getRole() != null ? e.getUser().getRole().getName() : null )
                            : null),
                    feedback
            );
        });
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Essay create(@ModelAttribute @Validated NewEssayDTO payload,
                        BindingResult validationResult,
                        @AuthenticationPrincipal User currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        if (currentUser == null) {
            throw new BadRequestException("Authentication required");
        }

        return this.essaysService.save(payload, currentUser);
    }

    @PutMapping(value = "/{essayId}", consumes = "multipart/form-data")
    public Essay update(@PathVariable Long essayId,
                        @Validated @ModelAttribute UpdateEssayDTO payload,
                        BindingResult validationResult,
                        @AuthenticationPrincipal User currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        if (currentUser == null) {
            throw new BadRequestException("Authentication required");
        }

        Essay existing = this.essaysService.findById(essayId);
        boolean isOwner = existing.getUser() != null && existing.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() != null && "ADMIN".equalsIgnoreCase(currentUser.getRole().getName());

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You do not have permissions to modify this resource");
        }

        return this.essaysService.update(essayId, payload);
    }

    @DeleteMapping("/{essayId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long essayId,
                       @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            throw new BadRequestException("Authentication required");
        }

        Essay existing = this.essaysService.findById(essayId);
        boolean isOwner = existing.getUser() != null && existing.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() != null && "ADMIN".equalsIgnoreCase(currentUser.getRole().getName());

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You do not have permissions to delete this resource");
        }

        this.essaysService.delete(essayId);
    }

    @GetMapping("/count-by-author/{userId}")
    public long countByAuthor(@PathVariable Long userId) {
        return essaysService.countByAuthor(userId);
    }

    @GetMapping("/by-category/{categoryId}")
    public ExampleEssayDTO getExampleByCategory(@PathVariable Long categoryId) {
        return essaysService.getExampleByCategory(categoryId);
    }
}
