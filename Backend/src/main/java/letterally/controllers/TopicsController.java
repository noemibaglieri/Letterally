package letterally.controllers;

import letterally.entities.Topic;
import letterally.entities.User;
import letterally.payloads.NewTopicDTO;
import letterally.payloads.UpdateTopicDTO;
import letterally.services.TopicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/topics")
public class TopicsController {

    @Autowired
    private TopicsService topicsService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Topic create(@RequestBody @Validated NewTopicDTO payload) {
        return this.topicsService.save(payload);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Topic update(@PathVariable Long id, @RequestBody @Validated UpdateTopicDTO payload) {
        return this.topicsService.update(id, payload);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable Long id) {
        this.topicsService.delete(id);
    }

    @GetMapping("/{id}")
    public Topic getById(@PathVariable Long id) {
        return this.topicsService.findById(id);
    }

    @GetMapping
    public Page<Topic> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal User currentUser
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        LocalDate referenceDate = (date != null) ? date : LocalDate.now();

        return topicsService.findAll(pageable, currentUser, referenceDate);
    }

    @GetMapping("/active")
    public List<Topic> getActive() {
        return this.topicsService.findActiveTopics(LocalDate.now());
    }

    @GetMapping("/category/{categoryId}")
    public Page<Topic> getByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return this.topicsService.findByCategory(categoryId, pageable);
    }
}
