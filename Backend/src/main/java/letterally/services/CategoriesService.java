package letterally.services;

import letterally.entities.Category;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.NotFoundException;
import letterally.payloads.NewCategoryDTO;
import letterally.payloads.UpdateCategoryDTO;
import letterally.repositories.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriesService {

    @Autowired
    private CategoriesRepository categoriesRepository;

    public Category save(NewCategoryDTO payload) {

        if (this.categoriesRepository.existsByNameIgnoreCase(payload.name())) {
            throw new BadRequestException("Category * " + payload.name() + " * already exists");
        }

        Category newCategory = new Category(payload.name(), payload.color(), payload.icon());
        return this.categoriesRepository.save(newCategory);
    }

    public Category update(Long id, UpdateCategoryDTO payload) {
        Category found = this.categoriesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category id * " + id + " * not found"));

        if (payload.name() != null && !payload.name().isBlank()) {
            String newName = payload.name().trim();
            if (!newName.equalsIgnoreCase(found.getName())
                    && this.categoriesRepository.existsByNameIgnoreCase(newName)) {
                throw new BadRequestException("Category * " + newName + " * already exists");
            }
            found.setName(newName);
        }

        if (payload.color() != null && !payload.color().isBlank()) {
            String color = payload.color().trim().toUpperCase();
            if (!color.startsWith("#")) color = "#" + color;
            if (!color.matches("^#[0-9A-F]{6}$")) {
                throw new BadRequestException("Color must be HEX like #AABBCC");
            }
            found.setColor(color);
        }

        if (payload.icon() != null && !payload.icon().isBlank()) {
            found.setIcon(payload.icon().trim());
        }

       return this.categoriesRepository.save(found);
    }


    public Category getById(Long id) {
        return this.categoriesRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
    }

    public List<Category> findAll() {
        return this.categoriesRepository.findAll();
    }

    public void delete(Long id) {
        Category category = this.categoriesRepository.findById(id).orElseThrow(() -> new NotFoundException("Category id * " + id + " * not found"));
        try {
            this.categoriesRepository.delete(category);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Category is in use and cannot be deleted");
        }
    }
}
