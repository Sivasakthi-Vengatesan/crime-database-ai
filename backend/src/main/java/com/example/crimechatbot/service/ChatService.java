package com.example.crimechatbot.service;

import com.example.crimechatbot.dto.ChatRequest;
import com.example.crimechatbot.dto.ChatResponse;
import com.example.crimechatbot.dto.ReasoningStep;
import com.example.crimechatbot.dto.SearchCriteria;
import com.example.crimechatbot.entity.CrimeRecord;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final RetrievalService retrievalService;
    private final RagService ragService;

    // Session cache: sessionId -> Conversation Context
    private final Map<String, SessionContext> sessions = new ConcurrentHashMap<>();

    public ChatService(RetrievalService retrievalService, RagService ragService) {
        this.retrievalService = retrievalService;
        this.ragService = ragService;
    }

    /**
     * Processes a user chat message end-to-end and returns an evidence-grounded response.
     */
    public ChatResponse processMessage(ChatRequest request) {
        String rawMessage = request.getMessage() != null ? request.getMessage().trim() : "";
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isBlank()) {
            sessionId = UUID.randomUUID().toString();
        }

        SessionContext context = sessions.computeIfAbsent(sessionId, k -> new SessionContext());

        // Step 1: Query Processing & Entity Extraction
        SearchCriteria criteria = retrievalService.parseCriteria(rawMessage, context.getLastRetrievedRecords());

        // Step 2: Hybrid Retrieval (Structured PostgreSQL + pgvector Vector Search)
        RetrievalService.RetrievalResult retrievalResult = retrievalService.retrieve(criteria, context.getLastRetrievedRecords());

        // Step 3: LangChain4j RAG Answer Generation
        RagService.RagResponse ragResponse = ragService.generateAnswer(rawMessage, retrievalResult.getEvidence(), context.getChatMessages());

        // Update Session History & Memory Context
        context.addMessage(UserMessage.from(rawMessage));
        context.addMessage(AiMessage.from(ragResponse.getAnswer()));
        if (!retrievalResult.getRecords().isEmpty()) {
            context.setLastRetrievedRecords(retrievalResult.getRecords());
        }

        // Combine Reasoning Steps
        List<ReasoningStep> allReasoning = new ArrayList<>(retrievalResult.getReasoning());
        allReasoning.add(ragResponse.getReasoningStep());

        return ChatResponse.builder()
                .answer(ragResponse.getAnswer())
                .evidence(retrievalResult.getEvidence())
                .reasoning(allReasoning)
                .terminalLog(retrievalResult.getTerminalLog())
                .totalFound(retrievalResult.getEvidence().size())
                .sessionId(sessionId)
                .build();
    }

    /**
     * Clears conversational history for a given session.
     */
    public void clearSession(String sessionId) {
        if (sessionId != null) {
            sessions.remove(sessionId);
            log.info("Cleared conversation session: {}", sessionId);
        }
    }

    public static class SessionContext {
        private final List<ChatMessage> chatMessages = new ArrayList<>();
        private List<CrimeRecord> lastRetrievedRecords = new ArrayList<>();

        public synchronized void addMessage(ChatMessage message) {
            chatMessages.add(message);
            // Retain last 10 messages for conversational context
            if (chatMessages.size() > 10) {
                chatMessages.remove(0);
            }
        }

        public synchronized List<ChatMessage> getChatMessages() {
            return new ArrayList<>(chatMessages);
        }

        public synchronized List<CrimeRecord> getLastRetrievedRecords() {
            return lastRetrievedRecords;
        }

        public synchronized void setLastRetrievedRecords(List<CrimeRecord> records) {
            this.lastRetrievedRecords = records;
        }
    }
}
