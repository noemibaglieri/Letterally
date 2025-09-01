package letterally.payloads;

public record UserRespDTO(
        Long id,
        String username,
        String email,
        String avatar
) {}