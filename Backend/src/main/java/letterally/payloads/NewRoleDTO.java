package letterally.payloads;

import jakarta.validation.constraints.NotBlank;

public record NewRoleDTO(
        @NotBlank(message = "Role name is required")
        String name
) {}