package letterally.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import letterally.entities.Category;
import letterally.entities.Essay;
import letterally.entities.Topic;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.NotFoundException;
import letterally.payloads.*;
import letterally.repositories.CategoriesRepository;
import letterally.repositories.EssaysRepository;
import letterally.repositories.TopicsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class EssaysService {

    @Autowired
    private EssaysRepository essaysRepository;

    @Autowired
    private TopicsRepository topicsRepository;

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private Cloudinary cloudinary;

    public Essay save(NewEssayDTO payload, User author) {

        Topic topic = this.topicsRepository.findById(payload.topicId())
                .orElseThrow(() -> new NotFoundException("Topic with id * " + payload.topicId() + " * not found"));

        String imageUrl = null;

        if (payload.image() != null && !payload.image().isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(payload.image().getBytes(), ObjectUtils.emptyMap());
                imageUrl = (String) uploadResult.get("url");
            } catch (IOException e) {
                throw new BadRequestException("Image upload failed");
            }
        }

        Essay newEssay = new Essay(
                payload.title().trim(),
                payload.content().trim(),
                imageUrl,
                topic,
                author
        );

        return this.essaysRepository.save(newEssay);
    }

    public Essay update(Long id, UpdateEssayDTO payload) {
        Essay found = this.essaysRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Essay with id * " + id + " * not found"));

        boolean changed = false;

        if (payload.title() != null) {
            String newTitle = payload.title().trim();
            if (newTitle.isBlank()) throw new BadRequestException("Title must not be blank");
            found.setTitle(newTitle);
            changed = true;
        }

        if (payload.content() != null) {
            String newContent = payload.content().trim();
            if (newContent.isBlank()) throw new BadRequestException("Essay content must not be blank");
            found.setContent(newContent);
            changed = true;
        }

        if (payload.image() != null && !payload.image().isEmpty()) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> uploadRes = (Map<String, Object>) cloudinary.uploader()
                        .upload(payload.image().getBytes(), ObjectUtils.emptyMap());

                String uploadedUrl = (String) uploadRes.get("url");
                if (uploadedUrl == null || uploadedUrl.isBlank()) {
                    throw new BadRequestException("Image upload failed: empty URL returned");
                }
                found.setImage(uploadedUrl);
                changed = true;

            } catch (IOException ex) {
                throw new BadRequestException("Image upload failed");
            }
        }

        if (!changed) return found;

        return this.essaysRepository.save(found);
    }

    public void delete(Long id) {
        Essay found = this.essaysRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Essay with id * " + id + " * not found"));
        this.essaysRepository.delete(found);
    }

    public Essay findById(Long id) {
        return this.essaysRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Essay with id * " + id + " * not found"));
    }

    public Page<Essay> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return this.essaysRepository.findAll(pageable);
    }

    public Page<Essay> findAllByUserId(Long userId, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return this.essaysRepository.findByUser_Id(userId, pageable);
    }

    public Page<Essay> findAllByTopicId(Long topicId, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return this.essaysRepository.findByTopic_Id(topicId, pageable);
    }

    public Page<Essay> findAllOrderByVotesAsc(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return this.essaysRepository.findAllOrderByAverageFeedbackAsc(pageable);
    }
    public long countByAuthor(Long userId) {
        return this.essaysRepository.countByUser_Id(userId);
    }


    public Page<Essay> findNotVotedByUser(Long userId, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return essaysRepository.findNotVotedByUser(userId, pageable);
    }

    public List<Essay> getTop3MostVotedThisWeek() {
        LocalDate today = LocalDate.now();

        LocalDate startOfWeek = today.with(java.time.DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(java.time.DayOfWeek.SUNDAY);

        LocalDateTime start = startOfWeek.atStartOfDay();
        LocalDateTime end = endOfWeek.atTime(23, 59, 59);

        return essaysRepository.findTop3MostVotedThisWeek(start, end, PageRequest.of(0, 3));
    }

    public ExampleEssayDTO getExampleByCategory(Long categoryId) {
        Essay e = essaysRepository
                .findTopByTopic_Category_IdOrderByCreatedOnDesc(categoryId)
                .orElseThrow(() -> new NotFoundException("No essay found for category id " + categoryId));

        TopicRespDTO topicDTO = null;
        if (e.getTopic() != null) {
            CategoryRespDTO catDTO = null;
            if (e.getTopic().getCategory() != null) {
                catDTO = new CategoryRespDTO(
                        e.getTopic().getCategory().getId(),
                        e.getTopic().getCategory().getName(),
                        e.getTopic().getCategory().getColor(),
                        e.getTopic().getCategory().getIcon()
                );
            }

            topicDTO = new TopicRespDTO(
                    e.getTopic().getId(),
                    e.getTopic().getTitle(),
                    e.getTopic().getDescription(),
                    e.getTopic().getEndDate() != null ? e.getTopic().getEndDate().toString() : null,
                    e.getTopic().getImage(),
                    catDTO,
                    e.getTopic().getCategory() != null ? e.getTopic().getCategory().getId() : null
            );
        }

        UserRespDTO userDTO = null;
        if (e.getUser() != null) {
            userDTO = new UserRespDTO(
                    e.getUser().getId(),
                    e.getUser().getUsername(),
                    e.getUser().getEmail(),
                    e.getUser().getAvatar(),
                    e.getUser().getRegisteredOn(),
                    e.getUser().getRole() != null ? e.getUser().getRole().getName() : null
            );
        }

        return new ExampleEssayDTO(
                e.getId(),
                e.getTitle(),
                e.getContent(),
                e.getCreatedOn(),
                e.getImage(),
                topicDTO,
                userDTO
        );
    }
}
