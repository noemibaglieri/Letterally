package letterally.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserDTO(

        @Size(min = 3, max = 15, message = "Username must be 3–15 characters")
        String username,

        @Email(message = "Invalid email format")
        String email,

        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @Size(max = 255, message = "Avatar URL is too long")
        String avatar
) {}
