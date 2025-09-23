package letterally.payloads;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public record UpdateTopicDTO(

        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
        String description,

        LocalDate startDate,

        Long categoryId,

        MultipartFile image
) {}

