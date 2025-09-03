package letterally.services;

import letterally.entities.Comment;
import letterally.entities.Essay;
import letterally.entities.Feedback;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.NotFoundException;
import letterally.exceptions.ValidationException;
import letterally.payloads.NewFeedbackDTO;
import letterally.payloads.UpdateFeedbackDTO;
import letterally.repositories.EssaysRepository;
import letterally.repositories.FeedbacksRepository;
import letterally.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbacksService {

    @Autowired
    private FeedbacksRepository feedbacksRepository;

    @Autowired
    private EssaysRepository essaysRepository;

    @Autowired
    private UsersRepository usersRepository;

    public Feedback save(NewFeedbackDTO payload, User user) {

        Essay essay = this.essaysRepository.findById(payload.essayId())
                .orElseThrow(() -> new NotFoundException("Essay with id * " + payload.essayId() + " * not found"));

        Feedback newFeedback = new Feedback(payload.value(), payload.content().trim(), essay, user);

        return this.feedbacksRepository.save(newFeedback);
    }

    public Feedback update(Long feedbackId, UpdateFeedbackDTO payload) {
        Feedback found = this.feedbacksRepository.findById(feedbackId)
                .orElseThrow(() -> new NotFoundException("Feedback id * " + feedbackId + " * not found"));

        boolean changed = false;

        if (payload.value() != null) {
            int value = payload.value();
            if (value < 1 || value > 10) throw new ValidationException(List.of("value must be between 1 and 10"));
            found.setValue(value);
            changed = true;
        }

        if (payload.content() != null) {
            String content = payload.content().trim();
            if (content.isBlank()) throw new BadRequestException("Comment content must not be blank");
            found.setContent(content);
            changed = true;
        }
        if (!changed) return found;
        return this.feedbacksRepository.save(found);
    }

    public void delete(Long feedbackId) {
        Feedback f = this.feedbacksRepository.findById(feedbackId)
                .orElseThrow(() -> new NotFoundException("Feedback id * " + feedbackId + " * not found"));
        this.feedbacksRepository.delete(f);
    }

    public Feedback findById(Long feedbackId) {
        return feedbacksRepository.findById(feedbackId)
                .orElseThrow(() -> new NotFoundException("Feedback id * " + feedbackId + " * not found"));
    }

    public Page<Feedback> findAllByEssay(Long essayId, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return feedbacksRepository.findByEssay_Id(essayId, pageable);
    }

    public Page<Feedback> findAllByUser(Long userId, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return feedbacksRepository.findByUser_Id(userId, pageable);
    }

    public double averageVote(Long essayId) {
        Double avg = feedbacksRepository.findAverageByEssayId(essayId);
        return avg == null ? 0.0 : avg;
    }

    public long countByEssay(Long essayId) {
        return feedbacksRepository.countByEssay_Id(essayId);
    }

    public double averageByAuthor(Long userId) {
        Double avg = feedbacksRepository.findAverageByAuthorId(userId);
        return avg == null ? 0.0 : avg;
    }
}