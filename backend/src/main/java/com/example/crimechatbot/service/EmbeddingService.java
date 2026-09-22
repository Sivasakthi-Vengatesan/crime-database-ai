package com.example.crimechatbot.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.onnx.allminilml6v2.AllMiniLmL6V2EmbeddingModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;

@Service
public class EmbeddingService {

    private static final Logger log = LoggerFactory.getLogger(EmbeddingService.class);
    private static final int EMBEDDING_DIM = 384;

    private final ObjectMapper objectMapper;
    private EmbeddingModel embeddingModel;
    private boolean onnxModelAvailable = false;

    public EmbeddingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        try {
            this.embeddingModel = new AllMiniLmL6V2EmbeddingModel();
            this.onnxModelAvailable = true;
            log.info("Initialized LangChain4j AllMiniLmL6V2 ONNX Embedding Model (dim={})", EMBEDDING_DIM);
        } catch (Throwable t) {
            log.warn("Could not initialize LangChain4j AllMiniLmL6V2 ONNX model: {}. Using deterministic high-dimensional semantic fallback.", t.getMessage());
            this.onnxModelAvailable = false;
        }
    }

    /**
     * Generate 384-dimensional dense embedding vector for a given text.
     */
    public float[] embed(String text) {
        if (text == null || text.isBlank()) {
            return new float[EMBEDDING_DIM];
        }

        if (onnxModelAvailable && embeddingModel != null) {
            try {
                Embedding embedding = embeddingModel.embed(text).content();
                return embedding.vector();
            } catch (Exception e) {
                log.warn("ONNX embedding computation error, falling back: {}", e.getMessage());
            }
        }

        return generateDeterministicSemanticVector(text);
    }

    /**
     * Serializes float array to JSON string for database storage.
     */
    public String toJson(float[] vector) {
        try {
            return objectMapper.writeValueAsString(vector);
        } catch (Exception e) {
            log.error("Error serializing vector to JSON", e);
            return "[]";
        }
    }

    /**
     * Deserializes JSON string back to float array.
     */
    public float[] fromJson(String json) {
        if (json == null || json.isBlank() || "[]".equals(json)) {
            return new float[EMBEDDING_DIM];
        }
        try {
            return objectMapper.readValue(json, float[].class);
        } catch (Exception e) {
            log.warn("Error deserializing vector from JSON: {}", json);
            return new float[EMBEDDING_DIM];
        }
    }

    /**
     * Calculates cosine similarity between two vector representations.
     */
    public double cosineSimilarity(float[] v1, float[] v2) {
        if (v1 == null || v2 == null || v1.length == 0 || v2.length == 0 || v1.length != v2.length) {
            return 0.0;
        }
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < v1.length; i++) {
            dotProduct += v1[i] * v2[i];
            normA += v1[i] * v1[i];
            normB += v2[i] * v2[i];
        }
        if (normA <= 0.0 || normB <= 0.0) {
            return 0.0;
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Deterministic n-gram semantic vector representation generator (384-dim)
     * used as reliable fallback ensuring consistent semantic similarity.
     */
    private float[] generateDeterministicSemanticVector(String text) {
        float[] vector = new float[EMBEDDING_DIM];
        String cleaned = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").trim();
        String[] words = cleaned.split("\\s+");

        for (String word : words) {
            if (word.isBlank()) continue;
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hash = md.digest(word.getBytes(StandardCharsets.UTF_8));
                for (int i = 0; i < hash.length && i < EMBEDDING_DIM / 8; i++) {
                    int idx = Math.abs(hash[i] * 31 + i) % EMBEDDING_DIM;
                    vector[idx] += 1.0f + (hash[i] & 0xFF) / 255.0f;
                }
            } catch (Exception ignored) {}
        }

        // Semantic synonym projection: map common crime concepts to shared vector indices
        mapConceptProjection(cleaned, vector);

        // Normalize vector to unit length
        double norm = 0.0;
        for (float v : vector) {
            norm += v * v;
        }
        norm = Math.sqrt(norm);
        if (norm > 0) {
            for (int i = 0; i < vector.length; i++) {
                vector[i] = (float) (vector[i] / norm);
            }
        }
        return vector;
    }

    private void mapConceptProjection(String cleaned, float[] vector) {
        if (cleaned.contains("phone") || cleaned.contains("mobile") || cleaned.contains("smartphone") || cleaned.contains("handset") || cleaned.contains("device")) {
            vector[10] += 3.5f;
            vector[11] += 2.8f;
        }
        if (cleaned.contains("railway") || cleaned.contains("train") || cleaned.contains("station") || cleaned.contains("commuter") || cleaned.contains("passenger") || cleaned.contains("metro") || cleaned.contains("coach")) {
            vector[20] += 3.5f;
            vector[21] += 2.8f;
        }
        if (cleaned.contains("stolen") || cleaned.contains("theft") || cleaned.contains("snatched") || cleaned.contains("disappeared") || cleaned.contains("lifted") || cleaned.contains("pickpocket")) {
            vector[30] += 3.5f;
            vector[31] += 2.8f;
        }
        if (cleaned.contains("cyber") || cleaned.contains("fraud") || cleaned.contains("otp") || cleaned.contains("banking") || cleaned.contains("scam") || cleaned.contains("phishing") || cleaned.contains("crypto")) {
            vector[40] += 3.5f;
            vector[41] += 2.8f;
        }
        if (cleaned.contains("vehicle") || cleaned.contains("car") || cleaned.contains("motorcycle") || cleaned.contains("scooter") || cleaned.contains("sedan") || cleaned.contains("bike") || cleaned.contains("auto")) {
            vector[50] += 3.5f;
            vector[51] += 2.8f;
        }
        if (cleaned.contains("robbery") || cleaned.contains("armed") || cleaned.contains("weapon") || cleaned.contains("knifepoint") || cleaned.contains("mugging") || cleaned.contains("looted")) {
            vector[60] += 3.5f;
            vector[61] += 2.8f;
        }
        if (cleaned.contains("burglary") || cleaned.contains("break-in") || cleaned.contains("villa") || cleaned.contains("warehouse") || cleaned.contains("apartment") || cleaned.contains("locked")) {
            vector[70] += 3.5f;
            vector[71] += 2.8f;
        }
    }
}
