package letterally.payloads;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateFeedbackDTO(
        @Min(1)
        @Max(10)
        Integer value,

        @Size(max = 5000, message = "Comment must not exceed 5000 characters")
        String content
) {}
