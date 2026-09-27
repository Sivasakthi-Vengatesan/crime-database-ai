package com.example.crimechatbot.dto;

import java.util.List;

public class ComplaintResponse {

    private String trackingNumber;
    private String caseId;
    private String status;
    private String severity;
    private String crimeType;
    private String location;
    private String incidentDate;
    private String complainantName;
    private String aiTriageSummary;
    private String recommendedPenalCode;
    private String assignedPoliceStation;
    private String createdAt;
    private String message;
    private List<String> investigationMilestones;

    public ComplaintResponse() {
    }

    public static ComplaintResponseBuilder builder() {
        return new ComplaintResponseBuilder();
    }

    public static class ComplaintResponseBuilder {
        private String trackingNumber;
        private String caseId;
        private String status;
        private String severity;
        private String crimeType;
        private String location;
        private String incidentDate;
        private String complainantName;
        private String aiTriageSummary;
        private String recommendedPenalCode;
        private String assignedPoliceStation;
        private String createdAt;
        private String message;
        private List<String> investigationMilestones;

        public ComplaintResponseBuilder trackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; return this; }
        public ComplaintResponseBuilder caseId(String caseId) { this.caseId = caseId; return this; }
        public ComplaintResponseBuilder status(String status) { this.status = status; return this; }
        public ComplaintResponseBuilder severity(String severity) { this.severity = severity; return this; }
        public ComplaintResponseBuilder crimeType(String crimeType) { this.crimeType = crimeType; return this; }
        public ComplaintResponseBuilder location(String location) { this.location = location; return this; }
        public ComplaintResponseBuilder incidentDate(String incidentDate) { this.incidentDate = incidentDate; return this; }
        public ComplaintResponseBuilder complainantName(String complainantName) { this.complainantName = complainantName; return this; }
        public ComplaintResponseBuilder aiTriageSummary(String aiTriageSummary) { this.aiTriageSummary = aiTriageSummary; return this; }
        public ComplaintResponseBuilder recommendedPenalCode(String recommendedPenalCode) { this.recommendedPenalCode = recommendedPenalCode; return this; }
        public ComplaintResponseBuilder assignedPoliceStation(String assignedPoliceStation) { this.assignedPoliceStation = assignedPoliceStation; return this; }
        public ComplaintResponseBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public ComplaintResponseBuilder message(String message) { this.message = message; return this; }
        public ComplaintResponseBuilder investigationMilestones(List<String> investigationMilestones) { this.investigationMilestones = investigationMilestones; return this; }

        public ComplaintResponse build() {
            ComplaintResponse res = new ComplaintResponse();
            res.setTrackingNumber(trackingNumber);
            res.setCaseId(caseId);
            res.setStatus(status);
            res.setSeverity(severity);
            res.setCrimeType(crimeType);
            res.setLocation(location);
            res.setIncidentDate(incidentDate);
            res.setComplainantName(complainantName);
            res.setAiTriageSummary(aiTriageSummary);
            res.setRecommendedPenalCode(recommendedPenalCode);
            res.setAssignedPoliceStation(assignedPoliceStation);
            res.setCreatedAt(createdAt);
            res.setMessage(message);
            res.setInvestigationMilestones(investigationMilestones);
            return res;
        }
    }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getCrimeType() { return crimeType; }
    public void setCrimeType(String crimeType) { this.crimeType = crimeType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getIncidentDate() { return incidentDate; }
    public void setIncidentDate(String incidentDate) { this.incidentDate = incidentDate; }

    public String getComplainantName() { return complainantName; }
    public void setComplainantName(String complainantName) { this.complainantName = complainantName; }

    public String getAiTriageSummary() { return aiTriageSummary; }
    public void setAiTriageSummary(String aiTriageSummary) { this.aiTriageSummary = aiTriageSummary; }

    public String getRecommendedPenalCode() { return recommendedPenalCode; }
    public void setRecommendedPenalCode(String recommendedPenalCode) { this.recommendedPenalCode = recommendedPenalCode; }

    public String getAssignedPoliceStation() { return assignedPoliceStation; }
    public void setAssignedPoliceStation(String assignedPoliceStation) { this.assignedPoliceStation = assignedPoliceStation; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getInvestigationMilestones() { return investigationMilestones; }
    public void setInvestigationMilestones(List<String> investigationMilestones) { this.investigationMilestones = investigationMilestones; }
}
