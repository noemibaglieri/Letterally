package letterally.payloads;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateCategoryDTO(

        @Size(min = 2, max = 50, message = "Name must be 2–50 characters")
        String name,

        @Pattern(regexp = "^#?[0-9A-Fa-f]{6}$",
                message = "Color must be a valid HEX code (e.g. #AABBCC)")
        String color,

        @Size(max = 255, message = "Icon path/URL is too long")
        String icon
) {}
