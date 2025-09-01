package letterally.payloads;
import letterally.entities.User;

import java.time.LocalDateTime;
import java.util.List;

public record EssayRespDTO(
        Long id,
        String title,
        String content,
        LocalDateTime createdOn,
        LocalDateTime lastUpdated,
        Long topicId,
        UserRespDTO user,
        List<VoteRespDTO> votes
) {}
