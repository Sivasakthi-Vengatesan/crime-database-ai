package com.example.crimechatbot.exception;

public class CrimeChatbotException extends RuntimeException {

    public CrimeChatbotException(String message) {
        super(message);
    }

    public CrimeChatbotException(String message, Throwable cause) {
        super(message, cause);
    }
}
