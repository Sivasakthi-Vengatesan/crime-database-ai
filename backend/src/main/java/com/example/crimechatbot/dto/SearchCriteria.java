package com.example.crimechatbot.dto;

import java.time.LocalDate;

public class SearchCriteria {
    private String rawQuery;
    private String semanticQuery;
    private String location;
    private String crimeType;
    private String status;
    private String severity;
    private Integer year;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxVictimAge;
    private Integer minVictimAge;
    private boolean isFollowUp;

    public SearchCriteria() {
    }

    public SearchCriteria(String rawQuery, String semanticQuery, String location, String crimeType,
                          String status, String severity, Integer year, LocalDate startDate,
                          LocalDate endDate, Integer maxVictimAge, Integer minVictimAge, boolean isFollowUp) {
        this.rawQuery = rawQuery;
        this.semanticQuery = semanticQuery;
        this.location = location;
        this.crimeType = crimeType;
        this.status = status;
        this.severity = severity;
        this.year = year;
        this.startDate = startDate;
        this.endDate = endDate;
        this.maxVictimAge = maxVictimAge;
        this.minVictimAge = minVictimAge;
        this.isFollowUp = isFollowUp;
    }

    public static SearchCriteriaBuilder builder() {
        return new SearchCriteriaBuilder();
    }

    public static class SearchCriteriaBuilder {
        private String rawQuery;
        private String semanticQuery;
        private String location;
        private String crimeType;
        private String status;
        private String severity;
        private Integer year;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer maxVictimAge;
        private Integer minVictimAge;
        private boolean isFollowUp;

        public SearchCriteriaBuilder rawQuery(String rawQuery) { this.rawQuery = rawQuery; return this; }
        public SearchCriteriaBuilder semanticQuery(String semanticQuery) { this.semanticQuery = semanticQuery; return this; }
        public SearchCriteriaBuilder location(String location) { this.location = location; return this; }
        public SearchCriteriaBuilder crimeType(String crimeType) { this.crimeType = crimeType; return this; }
        public SearchCriteriaBuilder status(String status) { this.status = status; return this; }
        public SearchCriteriaBuilder severity(String severity) { this.severity = severity; return this; }
        public SearchCriteriaBuilder year(Integer year) { this.year = year; return this; }
        public SearchCriteriaBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public SearchCriteriaBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public SearchCriteriaBuilder maxVictimAge(Integer maxVictimAge) { this.maxVictimAge = maxVictimAge; return this; }
        public SearchCriteriaBuilder minVictimAge(Integer minVictimAge) { this.minVictimAge = minVictimAge; return this; }
        public SearchCriteriaBuilder isFollowUp(boolean isFollowUp) { this.isFollowUp = isFollowUp; return this; }

        public SearchCriteria build() {
            return new SearchCriteria(rawQuery, semanticQuery, location, crimeType, status, severity, year, startDate, endDate, maxVictimAge, minVictimAge, isFollowUp);
        }
    }

    public String getRawQuery() { return rawQuery; }
    public void setRawQuery(String rawQuery) { this.rawQuery = rawQuery; }

    public String getSemanticQuery() { return semanticQuery; }
    public void setSemanticQuery(String semanticQuery) { this.semanticQuery = semanticQuery; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCrimeType() { return crimeType; }
    public void setCrimeType(String crimeType) { this.crimeType = crimeType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getMaxVictimAge() { return maxVictimAge; }
    public void setMaxVictimAge(Integer maxVictimAge) { this.maxVictimAge = maxVictimAge; }

    public Integer getMinVictimAge() { return minVictimAge; }
    public void setMinVictimAge(Integer minVictimAge) { this.minVictimAge = minVictimAge; }

    public boolean isFollowUp() { return isFollowUp; }
    public void setFollowUp(boolean isFollowUp) { this.isFollowUp = isFollowUp; }
}
