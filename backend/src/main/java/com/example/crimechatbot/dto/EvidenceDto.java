package com.example.crimechatbot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class EvidenceDto {

    private String caseId;
    private String crimeType;
    private String location;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;

    private String status;
    private String severity;
    private String description;
    private Integer victimAge;
    private Integer suspectAge;
    private Double similarityScore;

    public EvidenceDto() {
    }

    public EvidenceDto(String caseId, String crimeType, String location, LocalDate date,
                       String status, String severity, String description,
                       Integer victimAge, Integer suspectAge, Double similarityScore) {
        this.caseId = caseId;
        this.crimeType = crimeType;
        this.location = location;
        this.date = date;
        this.status = status;
        this.severity = severity != null ? severity : "Medium";
        this.description = description;
        this.victimAge = victimAge;
        this.suspectAge = suspectAge;
        this.similarityScore = similarityScore;
    }

    public static EvidenceDtoBuilder builder() {
        return new EvidenceDtoBuilder();
    }

    public static class EvidenceDtoBuilder {
        private String caseId;
        private String crimeType;
        private String location;
        private LocalDate date;
        private String status;
        private String severity = "Medium";
        private String description;
        private Integer victimAge;
        private Integer suspectAge;
        private Double similarityScore;

        public EvidenceDtoBuilder caseId(String caseId) { this.caseId = caseId; return this; }
        public EvidenceDtoBuilder crimeType(String crimeType) { this.crimeType = crimeType; return this; }
        public EvidenceDtoBuilder location(String location) { this.location = location; return this; }
        public EvidenceDtoBuilder date(LocalDate date) { this.date = date; return this; }
        public EvidenceDtoBuilder status(String status) { this.status = status; return this; }
        public EvidenceDtoBuilder severity(String severity) { this.severity = severity; return this; }
        public EvidenceDtoBuilder description(String description) { this.description = description; return this; }
        public EvidenceDtoBuilder victimAge(Integer victimAge) { this.victimAge = victimAge; return this; }
        public EvidenceDtoBuilder suspectAge(Integer suspectAge) { this.suspectAge = suspectAge; return this; }
        public EvidenceDtoBuilder similarityScore(Double similarityScore) { this.similarityScore = similarityScore; return this; }

        public EvidenceDto build() {
            return new EvidenceDto(caseId, crimeType, location, date, status, severity, description, victimAge, suspectAge, similarityScore);
        }
    }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getCrimeType() { return crimeType; }
    public void setCrimeType(String crimeType) { this.crimeType = crimeType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getVictimAge() { return victimAge; }
    public void setVictimAge(Integer victimAge) { this.victimAge = victimAge; }

    public Integer getSuspectAge() { return suspectAge; }
    public void setSuspectAge(Integer suspectAge) { this.suspectAge = suspectAge; }

    public Double getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(Double similarityScore) { this.similarityScore = similarityScore; }
}
