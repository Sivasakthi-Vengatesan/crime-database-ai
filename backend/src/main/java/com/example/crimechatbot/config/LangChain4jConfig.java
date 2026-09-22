package com.example.crimechatbot.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class LangChain4jConfig {

    private static final Logger log = LoggerFactory.getLogger(LangChain4jConfig.class);

    @Value("${langchain4j.llm.api-key:}")
    private String apiKey;

    @Value("${langchain4j.llm.model-name:gpt-4o-mini}")
    private String modelName;

    @Value("${langchain4j.llm.temperature:0.1}")
    private Double temperature;

    @Value("${langchain4j.llm.max-tokens:800}")
    private Integer maxTokens;

    @Bean
    @org.springframework.boot.autoconfigure.condition.ConditionalOnExpression("!'${langchain4j.llm.api-key:}'.isEmpty() && !'${langchain4j.llm.api-key:}'.equals('demo-key') && !'${langchain4j.llm.api-key:}'.startsWith('your_')")
    public ChatLanguageModel chatLanguageModel() {
        try {
            log.info("Configuring LangChain4j OpenAI Chat Model (model={})", modelName);
            return OpenAiChatModel.builder()
                    .apiKey(apiKey)
                    .modelName(modelName)
                    .temperature(temperature)
                    .maxTokens(maxTokens)
                    .timeout(Duration.ofSeconds(60))
                    .build();
        } catch (Exception e) {
            log.warn("Failed to initialize OpenAiChatModel: {}. Local grounded engine will be used.", e.getMessage());
            return null;
        }
    }
}
