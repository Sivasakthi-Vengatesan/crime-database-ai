package com.example.crimechatbot.dto;

public class ReasoningStep {
    private String stepName;
    private String description;
    private String details;
    private Long durationMs;

    public ReasoningStep() {
    }

    public ReasoningStep(String stepName, String description, String details, Long durationMs) {
        this.stepName = stepName;
        this.description = description;
        this.details = details;
        this.durationMs = durationMs;
    }

    public static ReasoningStepBuilder builder() {
        return new ReasoningStepBuilder();
    }

    public static class ReasoningStepBuilder {
        private String stepName;
        private String description;
        private String details;
        private Long durationMs;

        public ReasoningStepBuilder stepName(String stepName) { this.stepName = stepName; return this; }
        public ReasoningStepBuilder description(String description) { this.description = description; return this; }
        public ReasoningStepBuilder details(String details) { this.details = details; return this; }
        public ReasoningStepBuilder durationMs(Long durationMs) { this.durationMs = durationMs; return this; }

        public ReasoningStep build() {
            return new ReasoningStep(stepName, description, details, durationMs);
        }
    }

    public String getStepName() { return stepName; }
    public void setStepName(String stepName) { this.stepName = stepName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }
}
