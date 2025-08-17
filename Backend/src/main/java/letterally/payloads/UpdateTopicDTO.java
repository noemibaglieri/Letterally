package letterally.payloads;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateTopicDTO(

        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
        String description,

        @FutureOrPresent(message = "Start date must be today or in the future")
        LocalDate startDate,

        Long categoryId,

        String image
) {}

