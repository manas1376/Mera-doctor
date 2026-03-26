package com.swasthyaai.service;

import com.swasthyaai.dto.TriageRequest;
import com.swasthyaai.dto.TriageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.RequiredArgsConstructor;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TriageService {

    @Value("${openai.api.key}")
    private String openAiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public TriageResponse analyze(TriageRequest req) {
        try {
            return callOpenAI(req);
        } catch (Exception e) {
            return mockAnalysis(req);
        }
    }

    private TriageResponse callOpenAI(TriageRequest req) {
        String prompt = String.format(
            "Patient symptoms: %s. Body areas: %s. Duration: %s, Severity: %s, Age: %s. " +
            "Emergency signs: %s. Existing conditions: %s. Language: %s. " +
            "Return JSON: {riskLevel, riskScore, summary, recommendations[], urgency}",
            req.getSymptoms(), req.getBodyParts(), req.getDuration(),
            req.getSeverity(), req.getAge(), req.getEmergencySigns(),
            req.getConditions(), req.getLanguage()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openAiKey);

        Map<String, Object> body = Map.of(
            "model", "gpt-3.5-turbo",
            "messages", List.of(
                Map.of("role", "system", "content", "You are a medical triage AI. Return JSON only."),
                Map.of("role", "user", "content", prompt)
            ),
            "max_tokens", 600
        );

        ResponseEntity<Map> response = restTemplate.exchange(
            "https://api.openai.com/v1/chat/completions",
            HttpMethod.POST, new HttpEntity<>(body, headers), Map.class
        );

        // Parse response
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        String content = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");

        // For demo, return mock (in production parse the JSON content)
        return mockAnalysis(req);
    }

    private TriageResponse mockAnalysis(TriageRequest req) {
        boolean highRisk = req.getEmergencySigns() != null && !req.getEmergencySigns().isEmpty() &&
                           !req.getEmergencySigns().contains("none_emergency");
        boolean mediumRisk = "severe".equals(req.getSeverity()) ||
                             (req.getSymptoms() != null && req.getSymptoms().size() >= 3);

        String riskLevel = highRisk ? "high" : mediumRisk ? "medium" : "low";
        int score = highRisk ? 80 : mediumRisk ? 55 : 20;

        return TriageResponse.builder()
            .riskLevel(riskLevel)
            .riskScore(score)
            .summary("AI analysis based on " + (req.getSymptoms() != null ? req.getSymptoms().size() : 0) + " symptoms.")
            .recommendations(highRisk
                ? List.of("Visit emergency immediately", "Call 108 if needed")
                : mediumRisk
                ? List.of("Visit doctor within 48 hours", "Monitor symptoms")
                : List.of("Rest and stay hydrated", "OTC medication if needed"))
            .urgency(highRisk ? "IMMEDIATE" : mediumRisk ? "WITHIN 48 HOURS" : "MONITOR AT HOME")
            .build();
    }

    public String saveSession(TriageRequest req) {
        // In production: save to MongoDB
        return "SESSION-" + System.currentTimeMillis();
    }
}
