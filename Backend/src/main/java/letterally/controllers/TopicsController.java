package letterally.controllers;

import letterally.entities.Topic;
import letterally.payloads.NewTopicDTO;
import letterally.payloads.UpdateTopicDTO;
import letterally.services.TopicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<Topic> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return this.topicsService.findAll(pageable);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Topic> getActive() {
        return this.topicsService.findActiveTopics(LocalDate.now());
    }

    @GetMapping("/past")
    public Page<Topic> getPast(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return this.topicsService.findPastTopics(LocalDate.now(), pageable);
    }

    @GetMapping("/future")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<Topic> getFuture(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return this.topicsService.findFutureTopics(LocalDate.now(), pageable);
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
