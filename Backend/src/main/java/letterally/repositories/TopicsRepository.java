package letterally.repositories;

import letterally.entities.Topic;
import letterally.entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TopicsRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByStartDateLessThanEqualAndEndDateGreaterThan(LocalDate startDate, LocalDate endDate);
    Page<Topic> findByCategory(Category category, Pageable pageable);
    Page<Topic> findByEndDateBeforeOrStartDateLessThanEqualAndEndDateGreaterThan(
            LocalDate endDate, LocalDate startDate, LocalDate endDate2, Pageable pageable
    );

}

