package letterally.payloads;

import java.time.LocalDateTime;
import java.util.List;

public record ExampleEssayDTO(Long id,
                              String title,
                              String content,
                              LocalDateTime createdOn,
                              String image,
                              TopicRespDTO topic,
                              UserRespDTO user
                              ) {
}
