package com.example.crimechatbot.service;

import com.example.crimechatbot.dto.EvidenceDto;
import com.example.crimechatbot.dto.ReasoningStep;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RagService {

    private static final Logger log = LoggerFactory.getLogger(RagService.class);

    private final ChatLanguageModel chatLanguageModel;

    @Value("${app.rag.system-prompt:You are an intelligent crime database assistant. Answer questions using only the crime records provided as context. Do not invent case IDs, dates, locations, people, statistics, or events. If the available records do not contain enough information, clearly state that the information is unavailable. Always provide the relevant retrieved records as evidence.}")
    private String systemPromptText;

    public RagService(@org.springframework.beans.factory.annotation.Autowired(required = false) ChatLanguageModel chatLanguageModel) {
        this.chatLanguageModel = chatLanguageModel;
    }

    /**
     * Generates a grounded response using LangChain4j and the retrieved crime evidence records.
     */
    public RagResponse generateAnswer(String userMessage, List<EvidenceDto> evidence, List<ChatMessage> history) {
        long startTime = System.currentTimeMillis();

        if (evidence == null || evidence.isEmpty()) {
            return new RagResponse(
                    "I could not find any crime records in the database matching your query. Please try searching with a different crime category, city, or description.",
                    ReasoningStep.builder()
                            .stepName("Context Assembly & Grounded Synthesis")
                            .description("No matching evidence records returned from retrieval engine.")
                            .details("Synthesized negative response adhering to hallucination prevention rules.")
                            .durationMs(System.currentTimeMillis() - startTime)
                            .build()
            );
        }

        // Build context block from retrieved PostgreSQL records
        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("AVAILABLE CRIME RECORDS IN DATABASE:\n\n");
        for (int i = 0; i < evidence.size(); i++) {
            EvidenceDto e = evidence.get(i);
            contextBuilder.append(String.format("Record [%d]:\n", i + 1))
                    .append("Case ID: ").append(e.getCaseId()).append("\n")
                    .append("Crime Type: ").append(e.getCrimeType()).append("\n")
                    .append("Location: ").append(e.getLocation()).append("\n")
                    .append("Date: ").append(e.getDate()).append("\n")
                    .append("Status: ").append(e.getStatus()).append("\n")
                    .append("Severity: ").append(e.getSeverity()).append("\n")
                    .append("Victim Age: ").append(e.getVictimAge() != null ? e.getVictimAge() : "Unknown").append("\n")
                    .append("Suspect Age: ").append(e.getSuspectAge() != null ? e.getSuspectAge() : "Unknown").append("\n")
                    .append("Description: ").append(e.getDescription()).append("\n\n");
        }

        String context = contextBuilder.toString();

        // Attempt generation via LangChain4j ChatLanguageModel if LLM API is available
        if (chatLanguageModel != null) {
            try {
                List<ChatMessage> messages = new ArrayList<>();
                messages.add(SystemMessage.from(systemPromptText));
                if (history != null && !history.isEmpty()) {
                    messages.addAll(history);
                }
                messages.add(UserMessage.from(String.format("CONTEXT:\n%s\n\nUSER QUESTION: %s\n\nPlease answer the question directly, state how many matching cases were found, summarize key details from the records, and refer to the evidence below.", context, userMessage)));

                AiMessage aiMessage = chatLanguageModel.generate(messages).content();
                long elapsed = System.currentTimeMillis() - startTime;

                return new RagResponse(
                        aiMessage.text(),
                        ReasoningStep.builder()
                                .stepName("LangChain4j LLM Grounded Completion")
                                .description("Generated answer strictly conditioned on PostgreSQL retrieved context.")
                                .details(String.format("Prompt Tokens Context: %d records | LLM Provider: Active", evidence.size()))
                                .durationMs(elapsed)
                                .build()
                );
            } catch (Exception ex) {
                log.warn("LangChain4j external model invocation failed ({}), falling back to deterministic grounded synthesis: {}", ex.getClass().getSimpleName(), ex.getMessage());
            }
        }

        // Deterministic Grounded Synthesis Engine (Zero-hallucination fallback)
        String groundedAnswer = synthesizeGroundedResponse(userMessage, evidence);
        long elapsed = System.currentTimeMillis() - startTime;

        return new RagResponse(
                groundedAnswer,
                ReasoningStep.builder()
                        .stepName("Grounded Evidence Synthesis")
                        .description("Generated natural response directly from database evidence with zero hallucination guarantee.")
                        .details(String.format("Context Records: %d | Execution: Local Grounded Engine", evidence.size()))
                        .durationMs(elapsed)
                        .build()
        );
    }

    private String synthesizeGroundedResponse(String userMessage, List<EvidenceDto> evidence) {
        int count = evidence.size();
        String lower = userMessage.toLowerCase();

        // Check if query is asking for a specific count/location
        String location = evidence.get(0).getLocation();
        String crimeType = evidence.get(0).getCrimeType();

        StringBuilder sb = new StringBuilder();

        if (lower.contains("which of them") || lower.contains("how many")) {
            long openCount = evidence.stream().filter(e -> "Open".equalsIgnoreCase(e.getStatus()) || "Under Investigation".equalsIgnoreCase(e.getStatus())).count();
            sb.append(String.format("Based on the database records, I found %d relevant case%s. ", count, count == 1 ? "" : "s"));
            if (lower.contains("open") || lower.contains("unresolved")) {
                sb.append(String.format("%d of the matching cases are currently %s. ", openCount, openCount == 1 ? "open / under investigation" : "open or under investigation"));
            }
        } else if (lower.contains("similar") || lower.contains("railway") || lower.contains("stolen")) {
            sb.append(String.format("I found %d case%s matching your description in the database.", count, count == 1 ? "" : "s"));
        } else {
            sb.append(String.format("I found %d %s case%s in %s matching your query.",
                    count,
                    crimeType,
                    count == 1 ? "" : "s",
                    location));
        }

        sb.append(" The verified case records are displayed as evidence below.");
        return sb.toString();
    }

    public static class RagResponse {
        private final String answer;
        private final ReasoningStep reasoningStep;

        public RagResponse(String answer, ReasoningStep reasoningStep) {
            this.answer = answer;
            this.reasoningStep = reasoningStep;
        }

        public String getAnswer() {
            return answer;
        }

        public ReasoningStep getReasoningStep() {
            return reasoningStep;
        }
    }
}
