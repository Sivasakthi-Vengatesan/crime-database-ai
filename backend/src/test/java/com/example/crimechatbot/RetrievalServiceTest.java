package com.example.crimechatbot;

import com.example.crimechatbot.dto.SearchCriteria;
import com.example.crimechatbot.entity.CrimeRecord;
import com.example.crimechatbot.repository.CrimeRecordRepository;
import com.example.crimechatbot.service.EmbeddingService;
import com.example.crimechatbot.service.RetrievalService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class RetrievalServiceTest {

    private EmbeddingService embeddingService;
    private RetrievalService retrievalService;
    private final List<CrimeRecord> records = new ArrayList<>();

    @BeforeEach
    public void setUp() {
        embeddingService = new EmbeddingService(new ObjectMapper());
        CrimeRecordRepository repo = new InMemoryRepo(records);
        retrievalService = new RetrievalService(repo, embeddingService);
    }

    @Test
    public void testParseCriteriaLocationAndCrimeType() {
        SearchCriteria criteria = retrievalService.parseCriteria("Show theft cases in Mumbai", null);

        assertEquals("Mumbai", criteria.getLocation());
        assertEquals("Theft", criteria.getCrimeType());
        assertNull(criteria.getStatus());
    }

    @Test
    public void testParseCriteriaYearAndStatus() {
        SearchCriteria criteria = retrievalService.parseCriteria("Show unresolved robbery cases in Delhi from 2026", null);

        assertEquals("Delhi", criteria.getLocation());
        assertEquals("Robbery", criteria.getCrimeType());
        assertEquals("Unresolved", criteria.getStatus());
        assertEquals(2026, criteria.getYear());
    }

    @Test
    public void testSemanticRetrievalRanking() {
        records.clear();
        CrimeRecord record1 = CrimeRecord.builder()
                .id(1L)
                .caseId("CASE-1001")
                .crimeType("Mobile Phone Theft")
                .location("Chennai")
                .incidentDate(LocalDate.of(2026, 5, 14))
                .description("A mobile phone was stolen from a commuter while travelling through a crowded railway station.")
                .status("Open")
                .severity("Medium")
                .build();
        record1.setEmbeddingJson(embeddingService.toJson(embeddingService.embed(record1.getDescription())));

        CrimeRecord record2 = CrimeRecord.builder()
                .id(2L)
                .caseId("CASE-1002")
                .crimeType("Cybercrime")
                .location("Bengaluru")
                .incidentDate(LocalDate.of(2026, 6, 3))
                .description("A resident reported losing money after receiving a fraudulent banking message.")
                .status("Under Investigation")
                .severity("High")
                .build();
        record2.setEmbeddingJson(embeddingService.toJson(embeddingService.embed(record2.getDescription())));

        records.add(record1);
        records.add(record2);

        SearchCriteria criteria = retrievalService.parseCriteria("Someone snatched a smartphone at a train station", null);
        RetrievalService.RetrievalResult result = retrievalService.retrieve(criteria, null);

        assertFalse(result.getEvidence().isEmpty());
        assertEquals("CASE-1001", result.getEvidence().get(0).getCaseId());
    }

    private static class InMemoryRepo implements CrimeRecordRepository {
        private final List<CrimeRecord> list;
        public InMemoryRepo(List<CrimeRecord> list) { this.list = list; }
        @Override public List<CrimeRecord> findAll() { return new ArrayList<>(list); }
        @Override public Optional<CrimeRecord> findByCaseId(String caseId) { return list.stream().filter(r -> r.getCaseId().equals(caseId)).findFirst(); }
        @Override public List<CrimeRecord> findByLocationIgnoreCase(String location) { return list.stream().filter(r -> r.getLocation().equalsIgnoreCase(location)).toList(); }
        @Override public List<CrimeRecord> findByCrimeTypeIgnoreCase(String crimeType) { return list.stream().filter(r -> r.getCrimeType().equalsIgnoreCase(crimeType)).toList(); }
        @Override public List<CrimeRecord> findByStatusIgnoreCase(String status) { return list.stream().filter(r -> r.getStatus().equalsIgnoreCase(status)).toList(); }
        @Override public List<CrimeRecord> findBySeverityIgnoreCase(String severity) { return list.stream().filter(r -> r.getSeverity().equalsIgnoreCase(severity)).toList(); }
        @Override public List<CrimeRecord> findByStructuredFilters(String l, String c, String s, String sev, LocalDate sd, LocalDate ed) { return findAll(); }
        @Override public List<CrimeRecord> findRecordsWithoutEmbedding() { return List.of(); }
        @Override public void flush() {}
        @Override public <S extends CrimeRecord> S saveAndFlush(S entity) { return entity; }
        @Override public <S extends CrimeRecord> List<S> saveAllAndFlush(Iterable<S> entities) { return (List<S>) entities; }
        @Override public void deleteAllInBatch(Iterable<CrimeRecord> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Long> longs) {}
        @Override public void deleteAllInBatch() {}
        @Override public CrimeRecord getOne(Long aLong) { return null; }
        @Override public CrimeRecord getById(Long aLong) { return null; }
        @Override public CrimeRecord getReferenceById(Long aLong) { return null; }
        @Override public <S extends CrimeRecord> Optional<S> findOne(org.springframework.data.domain.Example<S> example) { return Optional.empty(); }
        @Override public <S extends CrimeRecord> List<S> findAll(org.springframework.data.domain.Example<S> example) { return List.of(); }
        @Override public <S extends CrimeRecord> List<S> findAll(org.springframework.data.domain.Example<S> example, org.springframework.data.domain.Sort sort) { return List.of(); }
        @Override public <S extends CrimeRecord> org.springframework.data.domain.Page<S> findAll(org.springframework.data.domain.Example<S> example, org.springframework.data.domain.Pageable pageable) { return null; }
        @Override public <S extends CrimeRecord> long count(org.springframework.data.domain.Example<S> example) { return list.size(); }
        @Override public <S extends CrimeRecord> boolean exists(org.springframework.data.domain.Example<S> example) { return false; }
        @Override public <S extends CrimeRecord, R> R findBy(org.springframework.data.domain.Example<S> example, java.util.function.Function<org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends CrimeRecord> S save(S entity) { list.add(entity); return entity; }
        @Override public <S extends CrimeRecord> List<S> saveAll(Iterable<S> entities) { entities.forEach(list::add); return (List<S>) entities; }
        @Override public Optional<CrimeRecord> findById(Long aLong) { return list.stream().filter(r -> r.getId().equals(aLong)).findFirst(); }
        @Override public boolean existsById(Long aLong) { return list.stream().anyMatch(r -> r.getId().equals(aLong)); }
        @Override public List<CrimeRecord> findAllById(Iterable<Long> longs) { return findAll(); }
        @Override public long count() { return list.size(); }
        @Override public void deleteById(Long aLong) { list.removeIf(r -> r.getId().equals(aLong)); }
        @Override public void delete(CrimeRecord entity) { list.remove(entity); }
        @Override public void deleteAllById(Iterable<? extends Long> longs) {}
        @Override public void deleteAll(Iterable<? extends CrimeRecord> entities) {}
        @Override public void deleteAll() { list.clear(); }
        @Override public List<CrimeRecord> findAll(org.springframework.data.domain.Sort sort) { return findAll(); }
        @Override public org.springframework.data.domain.Page<CrimeRecord> findAll(org.springframework.data.domain.Pageable pageable) { return null; }
        @Override public Optional<CrimeRecord> findOne(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return Optional.empty(); }
        @Override public List<CrimeRecord> findAll(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return findAll(); }
        @Override public org.springframework.data.domain.Page<CrimeRecord> findAll(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec, org.springframework.data.domain.Pageable pageable) { return null; }
        @Override public List<CrimeRecord> findAll(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec, org.springframework.data.domain.Sort sort) { return findAll(); }
        @Override public long count(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return list.size(); }
        @Override public boolean exists(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return false; }
        @Override public long delete(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec) { return 0; }
        @Override public <S extends CrimeRecord, R> R findBy(org.springframework.data.jpa.domain.Specification<CrimeRecord> spec, java.util.function.Function<org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
    }
}
