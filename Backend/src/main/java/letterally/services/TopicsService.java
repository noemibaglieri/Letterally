package letterally.services;

import letterally.entities.Category;
import letterally.entities.Topic;
import letterally.exceptions.NotFoundException;
import letterally.payloads.NewTopicDTO;
import letterally.payloads.UpdateTopicDTO;
import letterally.repositories.CategoriesRepository;
import letterally.repositories.TopicsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TopicsService {

    @Autowired
    private TopicsRepository topicsRepository;

    @Autowired
    private CategoriesRepository categoriesRepository;

    public Topic save(NewTopicDTO payload) {
        Category category = this.categoriesRepository.findById(payload.categoryId())
                .orElseThrow(() -> new NotFoundException("Category id * " + payload.categoryId() + " * not found"));

        Topic newTopic = new Topic(
                payload.title(),
                payload.description(),
                payload.startDate(),
                category,
                payload.image()
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

    public List<Topic> findActiveTopics(LocalDate today) {
        return this.topicsRepository.findByStartDateBeforeAndEndDateAfter(today, today);
    }

    public Page<Topic> findAll(Pageable pageable) {
        return topicsRepository.findAll(pageable);
    }

    public Page<Topic> findByCategory(Long categoryId, Pageable pageable) {
        Category category = this.categoriesRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category id * " + categoryId + " * not found"));
        return this.topicsRepository.findByCategory(category, pageable);
    }

    public Page<Topic> findPastTopics(LocalDate today, Pageable pageable) {
        return topicsRepository.findByEndDateBefore(today, pageable);
    }

    public Page<Topic> findFutureTopics(LocalDate today, Pageable pageable) {
        return topicsRepository.findByStartDateAfter(today, pageable);
    }
}

