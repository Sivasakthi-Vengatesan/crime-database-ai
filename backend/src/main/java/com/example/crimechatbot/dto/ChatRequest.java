package com.example.crimechatbot.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatRequest {

    @NotBlank(message = "Message must not be blank")
    private String message;

    private String sessionId;

    public ChatRequest() {
    }

    public ChatRequest(String message, String sessionId) {
        this.message = message;
        this.sessionId = sessionId;
    }

    public static ChatRequestBuilder builder() {
        return new ChatRequestBuilder();
    }

    public static class ChatRequestBuilder {
        private String message;
        private String sessionId;

        public ChatRequestBuilder message(String message) { this.message = message; return this; }
        public ChatRequestBuilder sessionId(String sessionId) { this.sessionId = sessionId; return this; }
        public ChatRequest build() { return new ChatRequest(message, sessionId); }
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}
