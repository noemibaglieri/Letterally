package letterally.payloads;

import java.time.LocalDateTime;

public record CommentRespDTO(
        Long id,
        String content,
        Long essayId,
        Long userId,
        String username,
        LocalDateTime createdOn
) {}

