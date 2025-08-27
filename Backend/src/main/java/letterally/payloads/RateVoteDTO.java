package letterally.payloads;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RateVoteDTO(
        @NotNull(message = "value is required")
        @Min(value = 1, message = "value must be between 1 and 10")
        @Max(value = 10, message = "value must be between 1 and 10")
        Integer value
) {}
