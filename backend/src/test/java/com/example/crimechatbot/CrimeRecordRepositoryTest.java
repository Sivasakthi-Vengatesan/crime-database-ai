package com.example.crimechatbot;

import com.example.crimechatbot.entity.CrimeRecord;
import com.example.crimechatbot.repository.CrimeRecordRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class CrimeRecordRepositoryTest {

    @Autowired
    private CrimeRecordRepository crimeRecordRepository;

    @Test
    public void testSaveAndFindByCaseId() {
        CrimeRecord record = CrimeRecord.builder()
                .caseId("CASE-TEST-999")
                .crimeType("Burglary")
                .location("Chennai")
                .incidentDate(LocalDate.of(2026, 6, 15))
                .description("Test break-in at commercial store.")
                .status("Open")
                .severity("High")
                .build();

        crimeRecordRepository.save(record);

        Optional<CrimeRecord> found = crimeRecordRepository.findByCaseId("CASE-TEST-999");
        assertTrue(found.isPresent());
        assertEquals("Chennai", found.get().getLocation());
        assertEquals("Burglary", found.get().getCrimeType());
    }

    @Test
    public void testFindByLocation() {
        CrimeRecord record = CrimeRecord.builder()
                .caseId("CASE-TEST-888")
                .crimeType("Fraud")
                .location("Hyderabad")
                .incidentDate(LocalDate.of(2026, 7, 1))
                .description("Test investment scam.")
                .status("Under Investigation")
                .severity("High")
                .build();

        crimeRecordRepository.save(record);

        List<CrimeRecord> results = crimeRecordRepository.findByLocationIgnoreCase("Hyderabad");
        assertFalse(results.isEmpty());
    }
}
