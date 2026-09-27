package com.example.crimechatbot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class ComplaintRequest {

    @NotBlank(message = "Complainant name is required")
    private String complainantName;

    private String contactPhone;
    private String contactEmail;

    @NotBlank(message = "Crime type is required")
    private String crimeType;

    @NotBlank(message = "Location/City is required")
    private String location;

    private LocalDate incidentDate;

    @NotBlank(message = "Incident description is required")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    private String description;

    private Integer victimAge;
    private Integer suspectAge;
    private String suspectDetails;
    private String severity;
    private String landmark;

    public ComplaintRequest() {
    }

    public ComplaintRequest(String complainantName, String contactPhone, String contactEmail,
                            String crimeType, String location, LocalDate incidentDate,
                            String description, Integer victimAge, Integer suspectAge,
                            String suspectDetails, String severity, String landmark) {
        this.complainantName = complainantName;
        this.contactPhone = contactPhone;
        this.contactEmail = contactEmail;
        this.crimeType = crimeType;
        this.location = location;
        this.incidentDate = incidentDate;
        this.description = description;
        this.victimAge = victimAge;
        this.suspectAge = suspectAge;
        this.suspectDetails = suspectDetails;
        this.severity = severity;
        this.landmark = landmark;
    }

    public String getComplainantName() { return complainantName; }
    public void setComplainantName(String complainantName) { this.complainantName = complainantName; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

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

    public String getSuspectDetails() { return suspectDetails; }
    public void setSuspectDetails(String suspectDetails) { this.suspectDetails = suspectDetails; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }
}
