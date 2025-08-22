package letterally.controllers;

import letterally.entities.Essay;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.ValidationException;
import letterally.payloads.NewEssayDTO;
import letterally.payloads.UpdateEssayDTO;
import letterally.services.EssaysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/essays")
public class EssaysController {

    @Autowired
    private EssaysService essaysService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<Essay> getAll(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "20") int size,
                              @RequestParam(defaultValue = "createdOn") String sortBy,
                              @RequestParam(defaultValue = "desc") String direction) {
        return this.essaysService.findAll(page, size, sortBy, direction);
    }

    @GetMapping("/{essayId}")
    public Essay getById(@PathVariable Long essayId) {
        return this.essaysService.findById(essayId);
    }

    @GetMapping("/by-user/{userId}")
    public Page<Essay> getAllByUserId(@PathVariable Long userId,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "20") int size,
                                      @RequestParam(defaultValue = "createdOn") String sortBy,
                                      @RequestParam(defaultValue = "desc") String direction) {
        return this.essaysService.findAllByUserId(userId, page, size, sortBy, direction);
    }

    @GetMapping("/by-topic/{topicId}")
    public Page<Essay> getAllByTopicId(@PathVariable Long topicId,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size,
                                       @RequestParam(defaultValue = "createdOn") String sortBy,
                                       @RequestParam(defaultValue = "desc") String direction) {
        return this.essaysService.findAllByTopicId(topicId, page, size, sortBy, direction);
    }

    @GetMapping("/ordered-by-votes-asc")
    public Page<Essay> getOrderedByVotesAsc(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "20") int size) {
        return this.essaysService.findAllOrderByVotesAsc(page, size);
    }

    @PostMapping
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
