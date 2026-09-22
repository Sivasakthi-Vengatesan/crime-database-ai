package com.example.crimechatbot.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "crime_records")
public class CrimeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", unique = true, nullable = false, length = 50)
    private String caseId;

    @Column(name = "crime_type", nullable = false, length = 100)
    private String crimeType;

    @Column(name = "location", nullable = false, length = 100)
    private String location;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(name = "description", nullable = false, length = 2000)
    private String description;

    @Column(name = "victim_age")
    private Integer victimAge;

    @Column(name = "suspect_age")
    private Integer suspectAge;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "severity", nullable = false, length = 20)
    private String severity;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "embedding_json", columnDefinition = "TEXT")
    private String embeddingJson;

    public CrimeRecord() {
    }

    public CrimeRecord(Long id, String caseId, String crimeType, String location, LocalDate incidentDate,
                       String description, Integer victimAge, Integer suspectAge, String status,
                       String severity, LocalDateTime createdAt, String embeddingJson) {
        this.id = id;
        this.caseId = caseId;
        this.crimeType = crimeType;
        this.location = location;
        this.incidentDate = incidentDate;
        this.description = description;
        this.victimAge = victimAge;
        this.suspectAge = suspectAge;
        this.status = status;
        this.severity = severity != null ? severity : "Medium";
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.embeddingJson = embeddingJson;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.severity == null) {
            this.severity = "Medium";
        }
    }

    public static CrimeRecordBuilder builder() {
        return new CrimeRecordBuilder();
    }

    public static class CrimeRecordBuilder {
        private Long id;
        private String caseId;
        private String crimeType;
        private String location;
        private LocalDate incidentDate;
        private String description;
        private Integer victimAge;
        private Integer suspectAge;
        private String status;
        private String severity = "Medium";
        private LocalDateTime createdAt;
        private String embeddingJson;

        public CrimeRecordBuilder id(Long id) { this.id = id; return this; }
        public CrimeRecordBuilder caseId(String caseId) { this.caseId = caseId; return this; }
        public CrimeRecordBuilder crimeType(String crimeType) { this.crimeType = crimeType; return this; }
        public CrimeRecordBuilder location(String location) { this.location = location; return this; }
        public CrimeRecordBuilder incidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; return this; }
        public CrimeRecordBuilder description(String description) { this.description = description; return this; }
        public CrimeRecordBuilder victimAge(Integer victimAge) { this.victimAge = victimAge; return this; }
        public CrimeRecordBuilder suspectAge(Integer suspectAge) { this.suspectAge = suspectAge; return this; }
        public CrimeRecordBuilder status(String status) { this.status = status; return this; }
        public CrimeRecordBuilder severity(String severity) { this.severity = severity; return this; }
        public CrimeRecordBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CrimeRecordBuilder embeddingJson(String embeddingJson) { this.embeddingJson = embeddingJson; return this; }

        public CrimeRecord build() {
            return new CrimeRecord(id, caseId, crimeType, location, incidentDate, description, victimAge, suspectAge, status, severity, createdAt, embeddingJson);
        }
    }

    // Standard Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getCrimeType() { return crimeType; }
    public void setCrimeType(String crimeType) { this.crimeType = crimeType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getVictimAge() { return victimAge; }
    public void setVictimAge(Integer victimAge) { this.victimAge = victimAge; }

    public Integer getSuspectAge() { return suspectAge; }
    public void setSuspectAge(Integer suspectAge) { this.suspectAge = suspectAge; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getEmbeddingJson() { return embeddingJson; }
    public void setEmbeddingJson(String embeddingJson) { this.embeddingJson = embeddingJson; }
}
