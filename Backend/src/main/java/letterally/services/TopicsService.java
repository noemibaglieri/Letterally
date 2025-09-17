package letterally.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import letterally.entities.Category;
import letterally.entities.Essay;
import letterally.entities.Topic;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.NotFoundException;
import letterally.payloads.NewEssayDTO;
import letterally.payloads.NewTopicDTO;
import letterally.payloads.UpdateTopicDTO;
import letterally.repositories.CategoriesRepository;
import letterally.repositories.TopicsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class TopicsService {

    @Autowired
    private TopicsRepository topicsRepository;

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private Cloudinary cloudinary;

    public Topic save(NewTopicDTO payload) {

        Category category = this.categoriesRepository.findById(payload.categoryId())
                .orElseThrow(() -> new NotFoundException("Category id * " + payload.categoryId() + " * not found"));

        String imageUrl = null;

        if (payload.image() != null && !payload.image().isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(payload.image().getBytes(), ObjectUtils.emptyMap());
                imageUrl = (String) uploadResult.get("url");
            } catch (IOException e) {
                throw new BadRequestException("Image upload failed");
            }
        }

        Topic newTopic = new Topic(
                payload.title(),
                payload.description(),
                payload.startDate(),
                category,
                imageUrl
        );

        return this.topicsRepository.save(newTopic);
    }

    public Topic update(Long id, UpdateTopicDTO payload) {
        Topic found = this.topicsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Topic id * " + id + " * not found"));

        if (payload.title() != null && !payload.title().isBlank()) {
            found.setTitle(payload.title().trim());
        }

        if (payload.description() != null && !payload.description().isBlank()) {
            found.setDescription(payload.description().trim());
        }

        if (payload.startDate() != null) {
            found.setStartDate(payload.startDate());
        }

        if (payload.categoryId() != null) {
            Category category = this.categoriesRepository.findById(payload.categoryId())
                    .orElseThrow(() -> new NotFoundException("Category id * " + payload.categoryId() + " * not found"));
            found.setCategory(category);
        }

        if (payload.image() != null) {
            String img = payload.image().trim();
            found.setImage(img.isBlank() ? null : img);
        }

        return this.topicsRepository.save(found);
    }

    public void delete(Long id) {
        Topic topic = this.topicsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Topic id * " + id + " * not found"));
        this.topicsRepository.delete(topic);
    }

    public Topic findById(Long id) {
        return this.topicsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Topic id * " + id + " * not found"));
    }

    public Topic findActiveTopic(LocalDate today) {
        return this.topicsRepository.findByStartDateLessThanEqualAndEndDateGreaterThan(today, today);
    }

    public Page<Topic> findAll(Pageable pageable, User currentUser, LocalDate referenceDate) {
        boolean isAdmin = currentUser.getRole().getName().equals("ADMIN");

        if (isAdmin) {
            return topicsRepository.findAll(pageable);
        } else {
            return topicsRepository.findByEndDateBeforeOrStartDateLessThanEqualAndEndDateGreaterThan(
                    referenceDate, referenceDate, referenceDate, pageable
            );
        }
    }

    public Page<Topic> findByCategory(Long categoryId, Pageable pageable) {
        Category category = this.categoriesRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category id * " + categoryId + " * not found"));
        return this.topicsRepository.findByCategory(category, pageable);
    }
}

