package letterally.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NewEssayDTO(
        @NotBlank(message = "Title must not be blank")
        String title,

        @NotBlank(message = "Essay content must not be blank")
        @Size(max = 30000, message = "Essay content cannot exceed 30,000 characters")
        String content,

        @NotNull(message = "topicId is required")
        Long topicId
) {
}
