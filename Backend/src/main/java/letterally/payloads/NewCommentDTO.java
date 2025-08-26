package letterally.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NewCommentDTO(
        @NotBlank @Size(max = 5000)
        String content,
        @NotNull
        Long essayId
) {}
