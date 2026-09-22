package com.example.crimechatbot.dto;

import java.util.ArrayList;
import java.util.List;

public class ChatResponse {

    private String answer;
    private List<EvidenceDto> evidence = new ArrayList<>();
    private List<ReasoningStep> reasoning = new ArrayList<>();
    private String terminalLog;
    private int totalFound;
    private String sessionId;

    public ChatResponse() {
    }

    public ChatResponse(String answer, List<EvidenceDto> evidence, List<ReasoningStep> reasoning,
                        String terminalLog, int totalFound, String sessionId) {
        this.answer = answer;
        this.evidence = evidence != null ? evidence : new ArrayList<>();
        this.reasoning = reasoning != null ? reasoning : new ArrayList<>();
        this.terminalLog = terminalLog;
        this.totalFound = totalFound;
        this.sessionId = sessionId;
    }

    public static ChatResponseBuilder builder() {
        return new ChatResponseBuilder();
    }

    public static class ChatResponseBuilder {
        private String answer;
        private List<EvidenceDto> evidence = new ArrayList<>();
        private List<ReasoningStep> reasoning = new ArrayList<>();
        private String terminalLog;
        private int totalFound;
        private String sessionId;

        public ChatResponseBuilder answer(String answer) { this.answer = answer; return this; }
        public ChatResponseBuilder evidence(List<EvidenceDto> evidence) { this.evidence = evidence; return this; }
        public ChatResponseBuilder reasoning(List<ReasoningStep> reasoning) { this.reasoning = reasoning; return this; }
        public ChatResponseBuilder terminalLog(String terminalLog) { this.terminalLog = terminalLog; return this; }
        public ChatResponseBuilder totalFound(int totalFound) { this.totalFound = totalFound; return this; }
        public ChatResponseBuilder sessionId(String sessionId) { this.sessionId = sessionId; return this; }

        public ChatResponse build() {
            return new ChatResponse(answer, evidence, reasoning, terminalLog, totalFound, sessionId);
        }
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public List<EvidenceDto> getEvidence() { return evidence; }
    public void setEvidence(List<EvidenceDto> evidence) { this.evidence = evidence; }

    public List<ReasoningStep> getReasoning() { return reasoning; }
    public void setReasoning(List<ReasoningStep> reasoning) { this.reasoning = reasoning; }

    public String getTerminalLog() { return terminalLog; }
    public void setTerminalLog(String terminalLog) { this.terminalLog = terminalLog; }

    public int getTotalFound() { return totalFound; }
    public void setTotalFound(int totalFound) { this.totalFound = totalFound; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}
