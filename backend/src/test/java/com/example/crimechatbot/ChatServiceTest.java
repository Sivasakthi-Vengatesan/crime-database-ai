package com.example.crimechatbot;

import com.example.crimechatbot.dto.ChatRequest;
import com.example.crimechatbot.dto.ChatResponse;
import com.example.crimechatbot.entity.CrimeRecord;
import com.example.crimechatbot.repository.CrimeRecordRepository;
import com.example.crimechatbot.service.ChatService;
import com.example.crimechatbot.service.EmbeddingService;
import com.example.crimechatbot.service.RagService;
import com.example.crimechatbot.service.RetrievalService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class ChatServiceTest {

    private ChatService chatService;

    @BeforeEach
    public void setUp() {
        ObjectMapper objectMapper = new ObjectMapper();
        EmbeddingService embeddingService = new EmbeddingService(objectMapper);

        // In-memory test implementation of repository
        CrimeRecordRepository inMemoryRepo = new TestCrimeRecordRepository();
        RetrievalService retrievalService = new RetrievalService(inMemoryRepo, embeddingService);
        RagService ragService = new RagService(null); // Local deterministic engine

        chatService = new ChatService(retrievalService, ragService);
    }

    @Test
    public void testProcessMessageEndToEnd() {
        ChatRequest request = new ChatRequest("Show theft cases in Mumbai", "test-session-1");
        ChatResponse response = chatService.processMessage(request);

        assertNotNull(response);
        assertNotNull(response.getAnswer());
        assertFalse(response.getEvidence().isEmpty());
        assertEquals("CASE-1003", response.getEvidence().get(0).getCaseId());
        assertEquals("Mumbai", response.getEvidence().get(0).getLocation());
        assertEquals("test-session-1", response.getSessionId());
    }

    @Test
    public void testClearSession() {
        assertDoesNotThrow(() -> chatService.clearSession("test-session-1"));
    }

    // Lightweight mock test repository
    private static class TestCrimeRecordRepository implements CrimeRecordRepository {
        private final CrimeRecord testRecord;

        public TestCrimeRecordRepository() {
            testRecord = CrimeRecord.builder()
                    .id(1L)
                    .caseId("CASE-1003")
                    .crimeType("Theft")
                    .location("Mumbai")
                    .incidentDate(LocalDate.of(2026, 4, 21))
                    .description("A motorcycle was stolen from residential parking.")
                    .status("Open")
                    .severity("Medium")
                    .embeddingJson("[]")
                    .build();
        }

        @Override public List<CrimeRecord> findAll() { return List.of(testRecord); }
        @Override public Optional<CrimeRecord> findByCaseId(String caseId) { return Optional.of(testRecord); }
        @Override public List<CrimeRecord> findByLocationIgnoreCase(String location) { return List.of(testRecord); }
        @Override public List<CrimeRecord> findByCrimeTypeIgnoreCase(String crimeType) { return List.of(testRecord); }
        @Override public List<CrimeRecord> findByStatusIgnoreCase(String status) { return List.of(testRecord); }
        @Override public List<CrimeRecord> findBySeverityIgnoreCase(String severity) { return List.of(testRecord); }
        @Override public List<CrimeRecord> findByStructuredFilters(String l, String c, String s, String sev, LocalDate sd, LocalDate ed) { return List.of(testRecord); }
        @Override public List<CrimeRecord> findRecordsWithoutEmbedding() { return List.of(); }
        @Override public void flush() {}
        @Override public <S extends CrimeRecord> S saveAndFlush(S entity) { return entity; }
        @Override public <S extends CrimeRecord> List<S> saveAllAndFlush(Iterable<S> entities) { return (List<S>) entities; }
        @Override public void deleteAllInBatch(Iterable<CrimeRecord> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Long> longs) {}
        @Override public void deleteAllInBatch() {}
        @Override public CrimeRecord getOne(Long aLong) { return testRecord; }
        @Override public CrimeRecord getById(Long aLong) { return testRecord; }
        @Override public CrimeRecord getReferenceById(Long aLong) { return testRecord; }
        @Override public <S extends CrimeRecord> Optional<S> findOne(org.springframework.data.domain.Example<S> example) { return Optional.empty(); }
        @Override public <S extends CrimeRecord> List<S> findAll(org.springframework.data.domain.Example<S> example) { return List.of(); }
        @Override public <S extends CrimeRecord> List<S> findAll(org.springframework.data.domain.Example<S> example, org.springframework.data.domain.Sort sort) { return List.of(); }
        @Override public <S extends CrimeRecord> org.springframework.data.domain.Page<S> findAll(org.springframework.data.domain.Example<S> example, org.springframework.data.domain.Pageable pageable) { return null; }
        @Override public <S extends CrimeRecord> long count(org.springframework.data.domain.Example<S> example) { return 1; }
        @Override public <S extends CrimeRecord> boolean exists(org.springframework.data.domain.Example<S> example) { return true; }
        @Override public <S extends CrimeRecord, R> R findBy(org.springframework.data.domain.Example<S> example, java.util.function.Function<org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends CrimeRecord> S save(S entity) { return entity; }
        @Override public <S extends CrimeRecord> List<S> saveAll(Iterable<S> entities) { return (List<S>) entities; }
        @Override public Optional<CrimeRecord> findById(Long aLong) { return Optional.of(testRecord); }
        @Override public boolean existsById(Long aLong) { return true; }
        @Override public List<CrimeRecord> findAllById(Iterable<Long> longs) { return List.of(testRecord); }
        @Override public long count() { return 1; }
        @Override public void deleteById(Long aLong) {}
        @Override public void delete(CrimeRecord entity) {}
        @Override public void deleteAllById(Iterable<? extends Long> longs) {}
        @Override public void deleteAll(Iterable<? extends CrimeRecord> entities) {}
        @Override public void deleteAll() {}
        @Override public List<CrimeRecord> findAll(org.springframework.data.domain.Sort sort) { return List.of(testRecord); }
        @Override public org.springframework.data.domain.Page<CrimeRecord> findAll(org.springframework.data.domain.Pageable pageable) { return null; }
        @Override public Optional<CrimeRecord> findOne(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return Optional.of(testRecord); }
        @Override public List<CrimeRecord> findAll(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return List.of(testRecord); }
        @Override public org.springframework.data.domain.Page<CrimeRecord> findAll(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec, org.springframework.data.domain.Pageable pageable) { return null; }
        @Override public List<CrimeRecord> findAll(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec, org.springframework.data.domain.Sort sort) { return List.of(testRecord); }
        @Override public long count(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return 1; }
        @Override public boolean exists(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return true; }
        @Override public long delete(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return 1; }
        @Override public <S extends CrimeRecord, R> R findBy(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec, java.util.function.Function<org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
    }
}
