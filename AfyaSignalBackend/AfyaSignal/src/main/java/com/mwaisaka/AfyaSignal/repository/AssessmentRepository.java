package com.mwaisaka.AfyaSignal.repository;

import com.mwaisaka.AfyaSignal.entity.Assessment;
import com.mwaisaka.AfyaSignal.enums.TriageCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, UUID> {

    List<Assessment> findByChvId(UUID chvId);

    List<Assessment> findByVillage(String village);

    List<Assessment> findByTriageCategory(TriageCategory category);

    List<Assessment> findByCreatedAtAfter(LocalDateTime date);

    long countByTriageCategory(TriageCategory category);

    long countByCreatedAtAfter(LocalDateTime date);

    // Outbreak detection: symptom clusters per village within a time window
    @Query("SELECT a FROM Assessment a WHERE a.village = :village " +
            "AND a.createdAt >= :since " +
            "AND (a.fever = true OR a.cough = true OR a.diarrhea = true " +
            "OR a.difficultyBreathing = true)")
    List<Assessment> findSymptomClustersByVillage(
            @Param("village") String village,
            @Param("since") LocalDateTime since
    );

    // Cases per village for admin dashboard
    @Query("SELECT a.village, COUNT(a) FROM Assessment a " +
            "GROUP BY a.village ORDER BY COUNT(a) DESC")
    List<Object[]> countByVillage();

    // Weekly trend — count per day for last 7 days
    @Query("SELECT CAST(a.createdAt AS date), COUNT(a) FROM Assessment a " +
            "WHERE a.createdAt >= :since GROUP BY CAST(a.createdAt AS date) " +
            "ORDER BY CAST(a.createdAt AS date)")
    List<Object[]> countByDaySince(@Param("since") LocalDateTime since);
}