package com.example.crimechatbot.controller;

import com.example.crimechatbot.dto.ChatRequest;
import com.example.crimechatbot.dto.ChatResponse;
import com.example.crimechatbot.repository.CrimeRecordRepository;
import com.example.crimechatbot.service.ChatService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;
    private final CrimeRecordRepository crimeRecordRepository;

    public ChatController(ChatService chatService, CrimeRecordRepository crimeRecordRepository) {
        this.chatService = chatService;
        this.crimeRecordRepository = crimeRecordRepository;
    }

    /**
     * Primary conversational endpoint for crime database natural language queries.
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        log.info("Received chat query: \"{}\" (session: {})", request.getMessage(), request.getSessionId());
        ChatResponse response = chatService.processMessage(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Clears conversational context for a given session.
     */
    @PostMapping("/chat/clear")
    public ResponseEntity<Map<String, String>> clearChat(@RequestParam(required = false) String sessionId) {
        chatService.clearSession(sessionId);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Conversation session reset successfully."
        ));
    }

    /**
     * Returns curated test queries based on the synthetic demo database.
     */
    @GetMapping("/sample-queries")
    public ResponseEntity<List<String>> getSampleQueries() {
        return ResponseEntity.ok(List.of(
                "Show theft cases in Chennai.",
                "Find cybercrime cases in Bengaluru.",
                "Show unresolved cases in Mumbai.",
                "Find mobile phone theft cases involving young victims.",
                "Show robbery cases reported during 2026.",
                "Find cases similar to a mobile phone being stolen from a railway passenger.",
                "Which cases are still under investigation?",
                "Show high severity cases in Delhi."
        ));
    }

    /**
     * Returns real-time database summary statistics for UI telemetry.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDatabaseStats() {
        long totalRecords = crimeRecordRepository.count();
        return ResponseEntity.ok(Map.of(
                "totalRecords", totalRecords,
                "status", "OPERATIONAL",
                "embeddingModel", "LangChain4j AllMiniLmL6V2 (384-dim)",
                "vectorEngine", "pgvector + Cosine Similarity",
                "isSyntheticData", true,
                "disclaimer", "Synthetic Demo Data — All crime records shown are fictional and created for demonstration purposes."
        ));
    }

    /**
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Intelligent Conversational AI for Crime Database"
        ));
    }
}
