package com.example.crimechatbot.exception;

import com.example.crimechatbot.dto.ChatResponse;
import com.example.crimechatbot.dto.ReasoningStep;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ChatResponse> handleValidationException(MethodArgumentNotValidException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        ChatResponse response = ChatResponse.builder()
                .answer("Please provide a valid question or query about crime records.")
                .evidence(Collections.emptyList())
                .reasoning(List.of(ReasoningStep.builder()
                        .stepName("Validation Error")
                        .description("Empty or blank input detected")
                        .details("Request body failed field validation.")
                        .build()))
                .terminalLog("$ [ERR] Validation failed: Message cannot be empty.")
                .totalFound(0)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(CrimeChatbotException.class)
    public ResponseEntity<ChatResponse> handleCrimeChatbotException(CrimeChatbotException ex) {
        log.error("CrimeChatbotException: {}", ex.getMessage());
        ChatResponse response = ChatResponse.builder()
                .answer("I encountered an issue while querying the crime database: " + ex.getMessage())
                .evidence(Collections.emptyList())
                .reasoning(List.of(ReasoningStep.builder()
                        .stepName("Query Execution Error")
                        .description(ex.getMessage())
                        .details("Safe fallback handled by system.")
                        .build()))
                .terminalLog("$ [WARN] Execution handled: " + ex.getMessage())
                .totalFound(0)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ChatResponse> handleGeneralException(Exception ex) {
        log.error("Unhandled server exception", ex);
        ChatResponse response = ChatResponse.builder()
                .answer("I apologize, but an unexpected error occurred while processing your request. Please try rephrasing your question.")
                .evidence(Collections.emptyList())
                .reasoning(List.of(ReasoningStep.builder()
                        .stepName("System Error")
                        .description("An internal error was safely captured.")
                        .details("Error details logged to secure diagnostic service.")
                        .build()))
                .terminalLog("$ [ERR] Internal exception caught: " + ex.getClass().getSimpleName())
                .totalFound(0)
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
