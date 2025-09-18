package letterally.payloads;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public record NewTopicDTO(

        @NotBlank(message = "Title must not be blank")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @NotBlank(message = "Description must not be blank")
        @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
        String description,

        @NotNull(message = "Start date is required")
        @FutureOrPresent(message = "Start date must be today or in the future")
        LocalDate startDate,

        @NotNull(message = "Category is required")
        Long categoryId,

        MultipartFile image
) {}
