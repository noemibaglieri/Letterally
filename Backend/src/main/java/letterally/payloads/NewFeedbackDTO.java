package letterally.payloads;

import jakarta.validation.constraints.*;

public record NewFeedbackDTO(
        @NotNull(message = "value is required")
        @Min(value = 1, message = "value must be between 1 and 10")
        @Max(value = 10, message = "value must be between 1 and 10")
        int value,

        @NotBlank
        @Size(max = 5000, message = "Comments must not exceed 5000 characters")
        String content,

        @NotNull
        Long essayId
) {}
