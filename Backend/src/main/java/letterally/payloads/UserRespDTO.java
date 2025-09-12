package letterally.payloads;

import letterally.entities.Role;

import java.time.LocalDate;

public record UserRespDTO(
        Long id,
        String username,
        String email,
        String avatar,
        LocalDate registeredOn,
        String roleName
) {}