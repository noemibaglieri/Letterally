package letterally.controllers;

import letterally.entities.User;
import letterally.entities.Vote;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.ValidationException;
import letterally.payloads.RateVoteDTO;
import letterally.payloads.VoteRespDTO;
import letterally.services.VotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/votes")
public class VotesController {

    @Autowired
    private VotesService votesService;

    @PostMapping("/{essayId}")
    public VoteRespDTO rate(@PathVariable Long essayId,
                                @RequestBody @Validated RateVoteDTO payload,
                                BindingResult validationResult,
                                @AuthenticationPrincipal User currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(e -> e.getDefaultMessage()).toList());
        }
        if (currentUser == null) throw new BadRequestException("Authentication required");

        Vote vote = this.votesService.rate(essayId, currentUser, payload);
        return new VoteRespDTO(
                vote.getId(),
                vote.getValue(),
                vote.getEssay().getId(),
                vote.getUser().getId(),
                vote.getCreatedOn(),
                vote.getLastUpdated()
        );
    }

    @DeleteMapping("/{essayId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unrate(@PathVariable Long essayId,
                       @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) throw new BadRequestException("Authentication required");
        this.votesService.unrate(essayId, currentUser);
    }

    @GetMapping("/{essayId}/count")
    public long count(@PathVariable Long essayId) {
        return this.votesService.count(essayId);
    }

    @GetMapping("/{essayId}/avg")
    public double average(@PathVariable Long essayId) {
        return this.votesService.average(essayId);
    }
}
