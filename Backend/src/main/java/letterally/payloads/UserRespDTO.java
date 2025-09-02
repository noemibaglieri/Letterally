package letterally.payloads;

import java.time.LocalDate;

public record UserRespDTO(
        Long id,
        String username,
        String email,
        String avatar,
        LocalDate registeredOn
) {}