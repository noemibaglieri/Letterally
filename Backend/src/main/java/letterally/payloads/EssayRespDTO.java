package letterally.payloads;

import java.time.LocalDateTime;
import java.util.List;

public record EssayRespDTO(
        Long id,
        String title,
        String content,
        LocalDateTime createdOn,
        LocalDateTime lastUpdated,
        TopicRespDTO topic,
        UserRespDTO user,
        List<VoteRespDTO> votes
) {}
