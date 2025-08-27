package letterally.services;

import letterally.entities.Essay;
import letterally.entities.User;
import letterally.entities.Vote;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.NotFoundException;
import letterally.exceptions.ValidationException;
import letterally.payloads.RateVoteDTO;
import letterally.repositories.EssaysRepository;
import letterally.repositories.VotesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VotesService {

    @Autowired
    private VotesRepository votesRepository;

    @Autowired
    private EssaysRepository essaysRepository;

    public Vote rate(Long essayId, User user, RateVoteDTO payload) {

        if (user == null) throw new BadRequestException("Authentication required");
        if (payload == null || payload.value() == null)
            throw new ValidationException(List.of("value is required"));

        int value = payload.value();
        if (value < 1 || value > 10)
            throw new ValidationException(List.of("value must be between 1 and 10"));

        if (essayId == null || essayId <= 0)
            throw new ValidationException(List.of("essayId must be a positive number"));

        Essay essay = this.essaysRepository.findById(essayId)
                .orElseThrow(() -> new NotFoundException("Essay with id * " + essayId + " * not found"));

        return this.votesRepository.findByUser_IdAndEssay_Id(user.getId(), essay.getId())
                .map(existing -> {
                    existing.setValue(value);
                    return this.votesRepository.save(existing);
                })
                .orElseGet(() -> this.votesRepository.save(new Vote(value, essay, user)));
    }

    public void unrate(Long essayId, User user) {

        if (user == null) throw new BadRequestException("Authentication required");
        if (essayId == null || essayId <= 0)
            throw new ValidationException(List.of("essayId must be a positive number"));

        if (!this.essaysRepository.existsById(essayId))
            throw new NotFoundException("Essay with id * " + essayId + " * not found");

        Vote existing = this.votesRepository.findByUser_IdAndEssay_Id(user.getId(), essayId)
                .orElseThrow(() -> new NotFoundException(
                        "Vote not found for essay * " + essayId + " * by user * " + user.getId() + " *"
                ));
        this.votesRepository.delete(existing);
    }

    public long count(Long essayId) {
        if (essayId == null || essayId <= 0)
            throw new ValidationException(List.of("essayId must be a positive number"));

        if (!this.essaysRepository.existsById(essayId))
            throw new NotFoundException("Essay with id * " + essayId + " * not found");

        return this.votesRepository.countByEssay_Id(essayId);
    }

    public double average(Long essayId) {
        if (essayId == null || essayId <= 0)
            throw new ValidationException(List.of("essayId must be a positive number"));

        if (!this.essaysRepository.existsById(essayId))
            throw new NotFoundException("Essay with id * " + essayId + " * not found");

        Double avg = this.votesRepository.findAverageByEssayId(essayId);
        return avg == null ? 0.0 : avg;
    }

    public int getMyVoteOrZero(Long essayId, User user) {
        if (user == null) throw new BadRequestException("Authentication required");
        if (essayId == null || essayId <= 0)
            throw new ValidationException(List.of("essayId * must be a positive number"));

        if (!this.essaysRepository.existsById(essayId))
            throw new NotFoundException("Essay with id * " + essayId + " * not found");

        return this.votesRepository.findByUser_IdAndEssay_Id(user.getId(), essayId)
                .map(Vote::getValue)
                .orElse(0);
    }
}
