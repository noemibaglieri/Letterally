package letterally.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record NewCategoryDTO(
        @NotBlank
        @Size(max=50)
        String name,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message="Color must be HEX like #AABBCC")
        String color,

        @NotBlank
        String icon
) {}
