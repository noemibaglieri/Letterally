package letterally.controllers;

import letterally.entities.Category;
import letterally.exceptions.ValidationException;
import letterally.payloads.CategoryRespDTO;
import letterally.payloads.NewCategoryDTO;
import letterally.payloads.UpdateCategoryDTO;
import letterally.services.CategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
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
    public CategoryRespDTO create(@RequestBody @Validated NewCategoryDTO payload,
                                  BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        Category category = this.categoriesService.save(payload);
        return new CategoryRespDTO(category.getId(), category.getName(), category.getColor(), category.getIcon());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public CategoryRespDTO update(@PathVariable Long id,
                                  @RequestBody @Validated UpdateCategoryDTO payload,
                                  BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        Category category = this.categoriesService.update(id, payload);
        return new CategoryRespDTO(category.getId(), category.getName(), category.getColor(), category.getIcon());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        this.categoriesService.delete(id);
    }

    @GetMapping("/{id}")
    public CategoryRespDTO getById(@PathVariable Long id) {
        Category category = this.categoriesService.getById(id);
        return new CategoryRespDTO(category.getId(), category.getName(), category.getColor(), category.getIcon());
    }

    @GetMapping
    public List<CategoryRespDTO> findAll() {
        List<Category> list = this.categoriesService.findAll();
        return list.stream()
                .map(category -> new CategoryRespDTO(category.getId(), category.getName(), category.getColor(), category.getIcon()))
                .toList();
    }
}

