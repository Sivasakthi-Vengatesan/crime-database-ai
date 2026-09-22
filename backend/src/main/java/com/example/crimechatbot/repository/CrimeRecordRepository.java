package com.example.crimechatbot.repository;

import com.example.crimechatbot.entity.CrimeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CrimeRecordRepository extends JpaRepository<CrimeRecord, Long>, JpaSpecificationExecutor<CrimeRecord> {

    Optional<CrimeRecord> findByCaseId(String caseId);

    List<CrimeRecord> findByLocationIgnoreCase(String location);

    List<CrimeRecord> findByCrimeTypeIgnoreCase(String crimeType);

    List<CrimeRecord> findByStatusIgnoreCase(String status);

    List<CrimeRecord> findBySeverityIgnoreCase(String severity);

    @Query("SELECT c FROM CrimeRecord c WHERE " +
           "(:location IS NULL OR LOWER(c.location) = LOWER(:location)) AND " +
           "(:crimeType IS NULL OR LOWER(c.crimeType) LIKE LOWER(CONCAT('%', :crimeType, '%'))) AND " +
           "(:status IS NULL OR LOWER(c.status) = LOWER(:status)) AND " +
           "(:severity IS NULL OR LOWER(c.severity) = LOWER(:severity)) AND " +
           "(:startDate IS NULL OR c.incidentDate >= :startDate) AND " +
           "(:endDate IS NULL OR c.incidentDate <= :endDate)")
    List<CrimeRecord> findByStructuredFilters(
            @Param("location") String location,
            @Param("crimeType") String crimeType,
            @Param("status") String status,
            @Param("severity") String severity,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT c FROM CrimeRecord c WHERE c.embeddingJson IS NULL OR c.embeddingJson = ''")
    List<CrimeRecord> findRecordsWithoutEmbedding();
}
