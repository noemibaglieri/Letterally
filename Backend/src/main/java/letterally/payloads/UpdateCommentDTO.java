package letterally.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCommentDTO(
        @NotBlank @Size(max = 5000)
        String content
) {}
