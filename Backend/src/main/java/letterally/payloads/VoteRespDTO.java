package letterally.payloads;

import java.time.LocalDateTime;

public record VoteRespDTO(
        Long id,
        int value,
        Long essayId,
        Long userId,
        LocalDateTime createdOn,
        LocalDateTime lastUpdated
) {}
