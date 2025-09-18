package letterally.payloads;

public record TopicRespDTO(
        Long id,
        String title,
        String description,
        String endDate,
        String image,
        CategoryRespDTO category,
        Long categoryId
) {}
