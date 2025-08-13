package letterally.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record NewUserDTO(

        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 10, message = "Username must be between 3 and 10 characters")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password,

        @Past(message = "Date of birth must be in the past")
        LocalDate dateOfBirth
) {}
