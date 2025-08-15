package letterally.controllers;

import letterally.entities.Category;
import letterally.payloads.NewCategoryDTO;
import letterally.payloads.UpdateCategoryDTO;
import letterally.services.CategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoriesController {

    @Autowired
    private CategoriesService categoriesService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Category create(@RequestBody @Validated NewCategoryDTO payload) {
        return this.categoriesService.save(payload);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Category update(@PathVariable Long id, @RequestBody @Validated UpdateCategoryDTO payload) {
        return this.categoriesService.update(id, payload);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        this.categoriesService.delete(id);
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return this.categoriesService.getById(id);
    }

    @GetMapping
    public List<Category> findAll() {
        return this.categoriesService.findAll();
    }
}
