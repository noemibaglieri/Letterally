package letterally.controllers;

import letterally.entities.Essay;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.ValidationException;
import letterally.payloads.EssayRespDTO;
import letterally.payloads.NewEssayDTO;
import letterally.payloads.UpdateEssayDTO;
import letterally.payloads.VoteRespDTO;
import letterally.services.EssaysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
            List<VoteRespDTO> votes = e.getVotes().stream()
                    .map(v -> new VoteRespDTO(
                            v.getId(),
                            v.getValue(),
                            (v.getEssay() != null ? v.getEssay().getId() : null),
                            (v.getUser()  != null ? v.getUser().getId()  : null),
                            v.getCreatedOn(),
                            v.getLastUpdated()
                    ))
                    .toList();

            return new EssayRespDTO(
                    e.getId(),
                    e.getTitle(),
                    e.getContent(),
                    e.getCreatedOn(),
                    e.getLastUpdated(),
                    (e.getTopic() != null) ? e.getTopic().getId() : null,
                    (e.getUser()  != null) ? e.getUser().getId()  : null,
                    votes
            );
        });

        return mapped;
    }

    @GetMapping("/{id}")
    public EssayRespDTO getById(@PathVariable Long id) {
        Essay e = essaysService.findById(id);

        List<VoteRespDTO> votes = e.getVotes().stream()
                .map(v -> new VoteRespDTO(
                        v.getId(),
                        v.getValue(),
                        (v.getEssay() != null ? v.getEssay().getId() : null), // essayId
                        (v.getUser()  != null ? v.getUser().getId()  : null), // userId
                        v.getCreatedOn(),
                        v.getLastUpdated()
                ))
                .toList();

        return new EssayRespDTO(
                e.getId(),
                e.getTitle(),
                e.getContent(),
                e.getCreatedOn(),
                e.getLastUpdated(),
                (e.getTopic() != null ? e.getTopic().getId() : null),
                (e.getUser()  != null ? e.getUser().getId()  : null),
                votes
        );
    }

    @GetMapping("/by-user/{userId}")
    public Page<EssayRespDTO> getAllByUserId(@PathVariable Long userId,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size,
                                             @RequestParam(defaultValue = "createdOn") String sortBy,
                                             @RequestParam(defaultValue = "desc") String direction) {
        Page<Essay> result = this.essaysService.findAllByUserId(userId, page, size, sortBy, direction);

        Page<EssayRespDTO> mapped = result.map((Essay e) -> {
            List<VoteRespDTO> votes = e.getVotes().stream()
                    .map(v -> new VoteRespDTO(
                            v.getId(),
                            v.getValue(),
                            (v.getEssay() != null ? v.getEssay().getId() : null),
                            (v.getUser()  != null ? v.getUser().getId()  : null),
                            v.getCreatedOn(),
                            v.getLastUpdated()
                    ))
                    .toList();

            return new EssayRespDTO(
                    e.getId(),
                    e.getTitle(),
                    e.getContent(),
                    e.getCreatedOn(),
                    e.getLastUpdated(),
                    (e.getTopic() != null ? e.getTopic().getId() : null),
                    (e.getUser()  != null ? e.getUser().getId()  : null),
                    votes
            );
        });

        return mapped;
    }


    @GetMapping("/by-topic/{topicId}")
    public Page<EssayRespDTO> getAllByTopicId(@PathVariable Long topicId,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size,
                                              @RequestParam(defaultValue = "createdOn") String sortBy,
                                              @RequestParam(defaultValue = "desc") String direction) {
        Page<Essay> result = this.essaysService.findAllByTopicId(topicId, page, size, sortBy, direction);

        Page<EssayRespDTO> mapped = result.map((Essay e) -> {
            List<VoteRespDTO> votes = e.getVotes().stream()
                    .map(v -> new VoteRespDTO(
                            v.getId(),
                            v.getValue(),
                            (v.getEssay() != null ? v.getEssay().getId() : null),
                            (v.getUser()  != null ? v.getUser().getId()  : null),
                            v.getCreatedOn(),
                            v.getLastUpdated()
                    ))
                    .toList();

            return new EssayRespDTO(
                    e.getId(),
                    e.getTitle(),
                    e.getContent(),
                    e.getCreatedOn(),
                    e.getLastUpdated(),
                    (e.getTopic() != null ? e.getTopic().getId() : null),
                    (e.getUser()  != null ? e.getUser().getId()  : null),
                    votes
            );
        });

        return mapped;
    }

    @GetMapping("/ordered-by-votes-asc")
    public Page<EssayRespDTO> getOrderedByVotesAsc(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        Page<Essay> result = this.essaysService.findAllOrderByVotesAsc(page, size);

        Page<EssayRespDTO> mapped = result.map((Essay e) -> {
            List<VoteRespDTO> votes = e.getVotes().stream()
                    .map(v -> new VoteRespDTO(
                            v.getId(),
                            v.getValue(),
                            (v.getEssay() != null ? v.getEssay().getId() : null),
                            (v.getUser()  != null ? v.getUser().getId()  : null),
                            v.getCreatedOn(),
                            v.getLastUpdated()
                    ))
                    .toList();

            return new EssayRespDTO(
                    e.getId(),
                    e.getTitle(),
                    e.getContent(),
                    e.getCreatedOn(),
                    e.getLastUpdated(),
                    (e.getTopic() != null ? e.getTopic().getId() : null),
                    (e.getUser()  != null ? e.getUser().getId()  : null),
                    votes
            );
        });

        return mapped;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Essay create(@RequestBody @Validated NewEssayDTO payload,
                        BindingResult validationResult,
                        @AuthenticationPrincipal User currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        if (currentUser == null) {
            throw new BadRequestException("Authentication required");
        }

        Essay created = this.essaysService.save(payload, currentUser);
        return this.essaysService.save(payload, currentUser);
    }

    @PatchMapping("/{essayId}")
    public Essay update(@PathVariable Long essayId,
                        @RequestBody @Validated UpdateEssayDTO payload,
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
}
