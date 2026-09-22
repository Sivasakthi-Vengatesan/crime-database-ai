package com.example.crimechatbot.config;

import com.example.crimechatbot.entity.CrimeRecord;
import com.example.crimechatbot.repository.CrimeRecordRepository;
import com.example.crimechatbot.service.EmbeddingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("!test")
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final CrimeRecordRepository crimeRecordRepository;
    private final EmbeddingService embeddingService;

    public DatabaseSeeder(CrimeRecordRepository crimeRecordRepository, EmbeddingService embeddingService) {
        this.crimeRecordRepository = crimeRecordRepository;
        this.embeddingService = embeddingService;
    }

    @Override
    public void run(String... args) {
        long totalRecords = crimeRecordRepository.count();
        log.info("Checking crime records in database. Current count: {}", totalRecords);

        List<CrimeRecord> unindexed = crimeRecordRepository.findRecordsWithoutEmbedding();
        if (!unindexed.isEmpty()) {
            log.info("Generating dense 384-dim embeddings for {} synthetic crime records...", unindexed.size());
            long start = System.currentTimeMillis();

            for (CrimeRecord record : unindexed) {
                String textToEmbed = String.format("%s. %s in %s. Status: %s. Severity: %s.",
                        record.getDescription(),
                        record.getCrimeType(),
                        record.getLocation(),
                        record.getStatus(),
                        record.getSeverity());
                float[] vector = embeddingService.embed(textToEmbed);
                record.setEmbeddingJson(embeddingService.toJson(vector));
            }
            crimeRecordRepository.saveAll(unindexed);
            log.info("Successfully generated and persisted embeddings for {} records in {} ms.",
                    unindexed.size(), (System.currentTimeMillis() - start));
        }

        log.info("Crime Database AI Backend initialized and ready. Total indexed cases: {}", crimeRecordRepository.count());
    }
}
