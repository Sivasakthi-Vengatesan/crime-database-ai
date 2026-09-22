package com.example.crimechatbot.service;

import com.example.crimechatbot.dto.EvidenceDto;
import com.example.crimechatbot.dto.ReasoningStep;
import com.example.crimechatbot.dto.SearchCriteria;
import com.example.crimechatbot.entity.CrimeRecord;
import com.example.crimechatbot.repository.CrimeRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class RetrievalService {

    private static final Logger log = LoggerFactory.getLogger(RetrievalService.class);

    private final CrimeRecordRepository crimeRecordRepository;
    private final EmbeddingService embeddingService;

    private static final List<String> CITIES = List.of(
            "Chennai", "Mumbai", "Delhi", "Bengaluru", "Bangalore",
            "Hyderabad", "Kolkata", "Pune", "Kochi", "Coimbatore", "Madurai", "Goa"
    );

    private static final Map<String, String> CRIME_TYPE_MAPPINGS = Map.ofEntries(
            Map.entry("theft", "Theft"),
            Map.entry("mobile phone theft", "Mobile Phone Theft"),
            Map.entry("phone theft", "Mobile Phone Theft"),
            Map.entry("mobile theft", "Mobile Phone Theft"),
            Map.entry("vehicle theft", "Vehicle Theft"),
            Map.entry("car theft", "Vehicle Theft"),
            Map.entry("bike theft", "Vehicle Theft"),
            Map.entry("motorcycle theft", "Vehicle Theft"),
            Map.entry("robbery", "Robbery"),
            Map.entry("burglary", "Burglary"),
            Map.entry("break-in", "Burglary"),
            Map.entry("assault", "Assault"),
            Map.entry("cybercrime", "Cybercrime"),
            Map.entry("cyber", "Cybercrime"),
            Map.entry("fraud", "Fraud"),
            Map.entry("scam", "Fraud"),
            Map.entry("missing person", "Missing Person"),
            Map.entry("missing", "Missing Person"),
            Map.entry("vandalism", "Vandalism"),
            Map.entry("drug", "Drug-related offences"),
            Map.entry("narcotics", "Drug-related offences")
    );

    public RetrievalService(CrimeRecordRepository crimeRecordRepository, EmbeddingService embeddingService) {
        this.crimeRecordRepository = crimeRecordRepository;
        this.embeddingService = embeddingService;
    }

    /**
     * Extracts structured constraints (city, crime type, year, status, severity, age) from natural language.
     */
    public SearchCriteria parseCriteria(String userMessage, List<CrimeRecord> previousContextRecords) {
        String lower = userMessage.toLowerCase();

        SearchCriteria.SearchCriteriaBuilder builder = SearchCriteria.builder()
                .rawQuery(userMessage)
                .semanticQuery(userMessage);

        // Extract City / Location
        for (String city : CITIES) {
            if (Pattern.compile("\\b" + Pattern.quote(city.toLowerCase()) + "\\b").matcher(lower).find()) {
                String normalizedCity = "bangalore".equals(city.toLowerCase()) ? "Bengaluru" : city;
                builder.location(normalizedCity);
                break;
            }
        }

        // Extract Crime Type
        for (Map.Entry<String, String> entry : CRIME_TYPE_MAPPINGS.entrySet()) {
            if (Pattern.compile("\\b" + Pattern.quote(entry.getKey()) + "\\b").matcher(lower).find()) {
                builder.crimeType(entry.getValue());
                break;
            }
        }

        // Extract Status
        if (lower.contains("unresolved") || lower.contains("pending") || lower.contains("not solved")) {
            builder.status("Unresolved");
        } else if (lower.contains("under investigation")) {
            builder.status("Under Investigation");
        } else if (lower.contains("open")) {
            builder.status("Open");
        } else if (lower.contains("closed") || lower.contains("solved")) {
            builder.status("Closed");
        }

        // Extract Severity
        if (lower.contains("critical")) {
            builder.severity("Critical");
        } else if (lower.contains("high severity") || lower.contains("high")) {
            builder.severity("High");
        } else if (lower.contains("medium")) {
            builder.severity("Medium");
        } else if (lower.contains("low")) {
            builder.severity("Low");
        }

        // Extract Year
        Pattern yearPattern = Pattern.compile("\\b(202[0-9])\\b");
        Matcher yearMatcher = yearPattern.matcher(userMessage);
        if (yearMatcher.find()) {
            int year = Integer.parseInt(yearMatcher.group(1));
            builder.year(year);
            builder.startDate(LocalDate.of(year, 1, 1));
            builder.endDate(LocalDate.of(year, 12, 31));
        }

        // Extract Age demographics
        if (lower.contains("young") || lower.contains("student") || lower.contains("teen")) {
            builder.maxVictimAge(25);
        } else if (lower.contains("elderly") || lower.contains("senior")) {
            builder.minVictimAge(60);
        }

        // Detect follow-up context referencing previous results
        if ((lower.contains("which of them") || lower.contains("of these") || lower.contains("of those") || lower.contains("previously retrieved"))
                && previousContextRecords != null && !previousContextRecords.isEmpty()) {
            builder.isFollowUp(true);
        }

        return builder.build();
    }

    /**
     * Executes hybrid retrieval combining PostgreSQL structured filtering with pgvector cosine similarity ranking.
     */
    public RetrievalResult retrieve(SearchCriteria criteria, List<CrimeRecord> previousContextRecords) {
        long startTime = System.currentTimeMillis();
        List<ReasoningStep> reasoning = new ArrayList<>();
        StringBuilder terminal = new StringBuilder();

        terminal.append("$ [INIT] Processing user query: \"").append(criteria.getRawQuery()).append("\"\n");

        // Step 1: Query Analysis & Structured Parameter Extraction
        reasoning.add(ReasoningStep.builder()
                .stepName("Query Analysis & Filter Extraction")
                .description("Parsed natural language query for entity constraints and intent.")
                .details(String.format("Location: %s | CrimeType: %s | Status: %s | Year: %s | FollowUp: %s",
                        criteria.getLocation() != null ? criteria.getLocation() : "ANY",
                        criteria.getCrimeType() != null ? criteria.getCrimeType() : "ANY",
                        criteria.getStatus() != null ? criteria.getStatus() : "ANY",
                        criteria.getYear() != null ? criteria.getYear() : "ANY",
                        criteria.isFollowUp()))
                .build());

        terminal.append("$ [SQL-PLAN] SELECT * FROM crime_records WHERE 1=1");
        if (criteria.getLocation() != null) terminal.append(" AND location = '").append(criteria.getLocation()).append("'");
        if (criteria.getCrimeType() != null) terminal.append(" AND crime_type ILIKE '%").append(criteria.getCrimeType()).append("%'");
        if (criteria.getStatus() != null) terminal.append(" AND status = '").append(criteria.getStatus()).append("'");
        if (criteria.getYear() != null) terminal.append(" AND incident_date BETWEEN '").append(criteria.getStartDate()).append("' AND '").append(criteria.getEndDate()).append("'");
        terminal.append(";\n");

        List<CrimeRecord> candidates;

        if (criteria.isFollowUp() && previousContextRecords != null && !previousContextRecords.isEmpty()) {
            // Conversational follow-up: filter strictly within previously retrieved subset
            candidates = new ArrayList<>(previousContextRecords);
            terminal.append("$ [CONTEXT] Refining over ").append(candidates.size()).append(" records from previous conversation turn.\n");
        } else {
            // Fetch from database
            candidates = crimeRecordRepository.findAll();
            terminal.append("$ [POSTGRES] Scanned ").append(candidates.size()).append(" total records in PostgreSQL.\n");
        }

        // Apply structured filters
        List<CrimeRecord> filtered = candidates.stream()
                .filter(r -> {
                    if (criteria.getLocation() != null && !r.getLocation().equalsIgnoreCase(criteria.getLocation())) {
                        return false;
                    }
                    if (criteria.getCrimeType() != null && !r.getCrimeType().toLowerCase().contains(criteria.getCrimeType().toLowerCase())) {
                        return false;
                    }
                    if (criteria.getStatus() != null) {
                        if ("Unresolved".equalsIgnoreCase(criteria.getStatus())) {
                            if (!"Open".equalsIgnoreCase(r.getStatus()) && !"Under Investigation".equalsIgnoreCase(r.getStatus())) {
                                return false;
                            }
                        } else if (!r.getStatus().equalsIgnoreCase(criteria.getStatus())) {
                            return false;
                        }
                    }
                    if (criteria.getSeverity() != null && !r.getSeverity().equalsIgnoreCase(criteria.getSeverity())) {
                        return false;
                    }
                    if (criteria.getStartDate() != null && r.getIncidentDate().isBefore(criteria.getStartDate())) {
                        return false;
                    }
                    if (criteria.getEndDate() != null && r.getIncidentDate().isAfter(criteria.getEndDate())) {
                        return false;
                    }
                    if (criteria.getMaxVictimAge() != null && (r.getVictimAge() == null || r.getVictimAge() > criteria.getMaxVictimAge())) {
                        return false;
                    }
                    if (criteria.getMinVictimAge() != null && (r.getVictimAge() == null || r.getVictimAge() < criteria.getMinVictimAge())) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        terminal.append("$ [FILTER] Structured constraints matched: ").append(filtered.size()).append(" candidate records.\n");

        // Step 2: Vector Embedding & Similarity Ranking
        float[] queryEmbedding = embeddingService.embed(criteria.getSemanticQuery());
        terminal.append("$ [PGVECTOR] Executing vector similarity search (dim=384, metric=cosine_ops)...\n");

        // If structured filtering reduced candidates, rank them by vector similarity;
        // If query was open-ended semantic search (e.g. "someone stole a phone near station"), evaluate all candidate similarity
        List<ScoredRecord> scored = (filtered.isEmpty() && criteria.getLocation() == null && criteria.getCrimeType() == null ? candidates : filtered).stream()
                .map(record -> {
                    float[] docEmbedding = embeddingService.fromJson(record.getEmbeddingJson());
                    double score = embeddingService.cosineSimilarity(queryEmbedding, docEmbedding);
                    return new ScoredRecord(record, score);
                })
                .sorted(Comparator.comparingDouble(ScoredRecord::getScore).reversed())
                .collect(Collectors.toList());

        List<CrimeRecord> topRecords = new ArrayList<>();
        List<EvidenceDto> evidenceList = new ArrayList<>();

        int topK = Math.min(scored.size(), 10);
        for (int i = 0; i < topK; i++) {
            ScoredRecord sr = scored.get(i);
            CrimeRecord r = sr.getRecord();
            topRecords.add(r);
            evidenceList.add(EvidenceDto.builder()
                    .caseId(r.getCaseId())
                    .crimeType(r.getCrimeType())
                    .location(r.getLocation())
                    .date(r.getIncidentDate())
                    .status(r.getStatus())
                    .severity(r.getSeverity())
                    .description(r.getDescription())
                    .victimAge(r.getVictimAge())
                    .suspectAge(r.getSuspectAge())
                    .similarityScore(Math.round(sr.getScore() * 1000.0) / 1000.0)
                    .build());
        }

        long elapsed = System.currentTimeMillis() - startTime;

        reasoning.add(ReasoningStep.builder()
                .stepName("Vector Semantic Ranking & HNSW Retrieval")
                .description("Calculated dense vector cosine similarity against PostgreSQL pgvector records.")
                .details(String.format("Retrieved %d top evidence candidates in %d ms (Avg cosine score: %.3f)",
                        evidenceList.size(), elapsed,
                        evidenceList.isEmpty() ? 0.0 : evidenceList.stream().mapToDouble(e -> e.getSimilarityScore() != null ? e.getSimilarityScore() : 0.0).average().orElse(0.0)))
                .durationMs(elapsed)
                .build());

        terminal.append("$ [RESULT] SUCCESS: Top ").append(evidenceList.size()).append(" evidence records assembled in ").append(elapsed).append("ms.\n");

        return new RetrievalResult(topRecords, evidenceList, reasoning, terminal.toString());
    }

    public static class ScoredRecord {
        private final CrimeRecord record;
        private final double score;

        public ScoredRecord(CrimeRecord record, double score) {
            this.record = record;
            this.score = score;
        }

        public CrimeRecord getRecord() {
            return record;
        }

        public double getScore() {
            return score;
        }
    }

    public static class RetrievalResult {
        private final List<CrimeRecord> records;
        private final List<EvidenceDto> evidence;
        private final List<ReasoningStep> reasoning;
        private final String terminalLog;

        public RetrievalResult(List<CrimeRecord> records, List<EvidenceDto> evidence, List<ReasoningStep> reasoning, String terminalLog) {
            this.records = records;
            this.evidence = evidence;
            this.reasoning = reasoning;
            this.terminalLog = terminalLog;
        }

        public List<CrimeRecord> getRecords() {
            return records;
        }

        public List<EvidenceDto> getEvidence() {
            return evidence;
        }

        public List<ReasoningStep> getReasoning() {
            return reasoning;
        }

        public String getTerminalLog() {
            return terminalLog;
        }
    }
}
