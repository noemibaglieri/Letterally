package letterally.payloads;

import java.time.LocalDateTime;

public record FeedbackRespDTO(
        Long id,
        Integer value,
        String content,
        UserRespDTO user,
        LocalDateTime createdOn,
        LocalDateTime lastUpdated
) {}
