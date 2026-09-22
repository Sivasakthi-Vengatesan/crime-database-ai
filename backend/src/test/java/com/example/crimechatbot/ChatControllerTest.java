package com.example.crimechatbot;

import com.example.crimechatbot.controller.ChatController;
import com.example.crimechatbot.dto.ChatRequest;
import com.example.crimechatbot.dto.ChatResponse;
import com.example.crimechatbot.dto.EvidenceDto;
import com.example.crimechatbot.exception.GlobalExceptionHandler;
import com.example.crimechatbot.repository.CrimeRecordRepository;
import com.example.crimechatbot.service.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ChatControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        objectMapper = new ObjectMapper();
        ChatService fakeChatService = new FakeChatService();
        CrimeRecordRepository fakeRepo = new FakeRepo();
        ChatController controller = new ChatController(fakeChatService, fakeRepo);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    public void testChatEndpointSuccess() throws Exception {
        ChatRequest request = new ChatRequest("Show theft cases in Chennai", "test-session");

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("I found 1 Mobile Phone Theft case in Chennai."))
                .andExpect(jsonPath("$.evidence[0].caseId").value("CASE-1001"))
                .andExpect(jsonPath("$.evidence[0].location").value("Chennai"));
    }

    @Test
    public void testChatValidationFailureForEmptyMessage() throws Exception {
        ChatRequest invalidRequest = new ChatRequest("", "test-session");

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.answer").exists());
    }

    @Test
    public void testSampleQueriesEndpoint() throws Exception {
        mockMvc.perform(get("/api/sample-queries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    private static class FakeChatService extends ChatService {
        public FakeChatService() { super(null, null); }

        @Override
        public ChatResponse processMessage(ChatRequest request) {
            EvidenceDto evidence = EvidenceDto.builder()
                    .caseId("CASE-1001")
                    .crimeType("Mobile Phone Theft")
                    .location("Chennai")
                    .date(LocalDate.of(2026, 5, 14))
                    .status("Open")
                    .severity("Medium")
                    .description("A mobile phone was stolen at a railway station.")
                    .build();

            return ChatResponse.builder()
                    .answer("I found 1 Mobile Phone Theft case in Chennai.")
                    .evidence(List.of(evidence))
                    .totalFound(1)
                    .sessionId(request.getSessionId())
                    .build();
        }
    }

    private static class FakeRepo extends ChatServiceTestFakeRepo {}

    private static class ChatServiceTestFakeRepo implements CrimeRecordRepository {
        @Override public long count() { return 105; }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findAll() { return List.of(); }
        @Override public Optional<com.example.crimechatbot.entity.CrimeRecord> findByCaseId(String caseId) { return Optional.empty(); }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findByLocationIgnoreCase(String location) { return List.of(); }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findByCrimeTypeIgnoreCase(String crimeType) { return List.of(); }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findByStatusIgnoreCase(String status) { return List.of(); }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findBySeverityIgnoreCase(String severity) { return List.of(); }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findByStructuredFilters(String l, String c, String s, String sev, LocalDate sd, LocalDate ed) { return List.of(); }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findRecordsWithoutEmbedding() { return List.of(); }
        @Override public void flush() {}
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> S saveAndFlush(S entity) { return entity; }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> List<S> saveAllAndFlush(Iterable<S> entities) { return (List<S>) entities; }
        @Override public void deleteAllInBatch(Iterable<com.example.crimechatbot.entity.CrimeRecord> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Long> longs) {}
        @Override public void deleteAllInBatch() {}
        @Override public com.example.crimechatbot.entity.CrimeRecord getOne(Long aLong) { return null; }
        @Override public com.example.crimechatbot.entity.CrimeRecord getById(Long aLong) { return null; }
        @Override public com.example.crimechatbot.entity.CrimeRecord getReferenceById(Long aLong) { return null; }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> Optional<S> findOne(org.springframework.data.domain.Example<S> example) { return Optional.empty(); }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> List<S> findAll(org.springframework.data.domain.Example<S> example) { return List.of(); }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> List<S> findAll(org.springframework.data.domain.Example<S> example, org.springframework.data.domain.Sort sort) { return List.of(); }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> org.springframework.data.domain.Page<S> findAll(org.springframework.data.domain.Example<S> example, org.springframework.data.domain.Pageable pageable) { return null; }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> long count(org.springframework.data.domain.Example<S> example) { return 0; }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> boolean exists(org.springframework.data.domain.Example<S> example) { return false; }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord, R> R findBy(org.springframework.data.domain.Example<S> example, java.util.function.Function<org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> S save(S entity) { return entity; }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord> List<S> saveAll(Iterable<S> entities) { return (List<S>) entities; }
        @Override public Optional<com.example.crimechatbot.entity.CrimeRecord> findById(Long aLong) { return Optional.empty(); }
        @Override public boolean existsById(Long aLong) { return false; }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findAllById(Iterable<Long> longs) { return List.of(); }
        @Override public void deleteById(Long aLong) {}
        @Override public void delete(com.example.crimechatbot.entity.CrimeRecord entity) {}
        @Override public void deleteAllById(Iterable<? extends Long> longs) {}
        @Override public void deleteAll(Iterable<? extends com.example.crimechatbot.entity.CrimeRecord> entities) {}
        @Override public void deleteAll() {}
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findAll(org.springframework.data.domain.Sort sort) { return List.of(); }
        @Override public org.springframework.data.domain.Page<com.example.crimechatbot.entity.CrimeRecord> findAll(org.springframework.data.domain.Pageable pageable) { return null; }
        @Override public Optional<com.example.crimechatbot.entity.CrimeRecord> findOne(org.springframework.data.jpa.domain.Specification<com.example.crimechatbot.entity.CrimeRecord> spec) { return Optional.empty(); }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findAll(org.springframework.data.jpa.domain.Specification<com.example.crimechatbot.entity.CrimeRecord> spec) { return List.of(); }
        @Override public org.springframework.data.domain.Page<com.example.crimechatbot.entity.CrimeRecord> findAll(org.springframework.data.jpa.domain.Specification<com.example.crimechatbot.entity.CrimeRecord> spec, org.springframework.data.domain.Pageable pageable) { return null; }
        @Override public List<com.example.crimechatbot.entity.CrimeRecord> findAll(org.springframework.data.jpa.domain.Specification<com.example.crimechatbot.entity.CrimeRecord> spec, org.springframework.data.domain.Sort sort) { return List.of(); }
        @Override public long count(org.springframework.data.jpa.domain.Specification<com.example.crimechatbot.entity.CrimeRecord> spec) { return 0; }
        @Override public boolean exists(org.springframework.data.jpa.domain.Specification<com.example.crimechatbot.entity.CrimeRecord> spec) { return false; }
        @Override public long delete(org.springframework.data.jpa.domain.Specification<com.example.crimechatbot.entity.CrimeRecord> spec) { return 0; }
        @Override public <S extends com.example.crimechatbot.entity.CrimeRecord, R> R findBy(org.springframework.data.jpa.domain.Specification<com.example.crimechatbot.entity.CrimeRecord> spec, java.util.function.Function<org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
    }
}
