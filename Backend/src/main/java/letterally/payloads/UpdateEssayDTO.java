package letterally.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateEssayDTO(

        @NotBlank(message = "Title must not be blank")
        String title,

        @Size(max = 30000, message = "Essay content cannot exceed 30,000 characters")
        String content) {
}
