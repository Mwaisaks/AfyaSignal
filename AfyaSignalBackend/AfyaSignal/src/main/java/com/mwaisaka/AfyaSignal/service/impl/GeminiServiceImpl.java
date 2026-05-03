package com.mwaisaka.AfyaSignal.service.impl;

import com.mwaisaka.AfyaSignal.dto.AssessmentRequest;
import com.mwaisaka.AfyaSignal.enums.TriageCategory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
@Slf4j
public class GeminiServiceImpl {

    private final RestClient restClient;
    private final String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public GeminiServiceImpl(@Value("${gemini.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.restClient = RestClient.create();
    }

    public String generateExplanation(AssessmentRequest request, TriageCategory category) {
        try {
            String prompt = buildPrompt(request, category);
            String requestBody = buildRequestBody(prompt);

            String response = restClient.post()
                    .uri(GEMINI_URL + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return parseResponse(response);

        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return buildFallbackExplanation(request, category);
        }
    }

    private String buildPrompt(AssessmentRequest request, TriageCategory category) {
        StringBuilder symptoms = new StringBuilder();
        if (request.isFever()) symptoms.append("fever")
                .append(request.getFeverDays() != null ? " for " + request.getFeverDays() + " days" : "").append(", ");
        if (request.isCough()) symptoms.append("cough, ");
        if (request.isDifficultyBreathing()) symptoms.append("difficulty breathing, ");
        if (request.isDiarrhea()) symptoms.append("diarrhea, ");
        if (request.isVomiting()) symptoms.append("vomiting, ");
        if (request.isLethargy()) symptoms.append("lethargy, ");
        if (request.isSeizures()) symptoms.append("seizures, ");
        if (request.isRash()) symptoms.append("rash, ");

        return String.format("""
            You are a community health support assistant in Kenya.
            A Community Health Volunteer has assessed a child with the following details:
            - Age: %d months
            - Symptoms: %s
            - Respiratory rate: %s breaths/min
            - Temperature: %s°C
            - Triage category assigned: %s

            Write a 2-3 sentence plain-language explanation for the CHV explaining:
            1. Why this risk level was assigned
            2. What to watch for
            3. What action to take

            Use simple, calm, and direct language. Do not use medical jargon.
            Do not say "I" or "the AI". Speak directly to the CHV.
            """,
                request.getAgeMonths(),
                symptoms.toString().replaceAll(", $", ""),
                request.getRespiratoryRate() != null ? request.getRespiratoryRate() : "not recorded",
                request.getTemperature() != null ? request.getTemperature() : "not recorded",
                category.name()
        );
    }

    private String buildRequestBody(String prompt) {
        JsonObject root = new JsonObject();
        JsonArray contents = new JsonArray();
        JsonObject content = new JsonObject();
        JsonArray parts = new JsonArray();
        JsonObject part = new JsonObject();

        part.addProperty("text", prompt);
        parts.add(part);
        content.add("parts", parts);
        contents.add(content);
        root.add("contents", contents);

        return root.toString();
    }

    private String parseResponse(String responseBody) {
        try {
            JsonObject root = JsonParser.parseString(responseBody).getAsJsonObject();
            return root
                    .getAsJsonArray("candidates")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("content")
                    .getAsJsonArray("parts")
                    .get(0).getAsJsonObject()
                    .get("text").getAsString()
                    .trim();
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            return "Unable to generate explanation at this time.";
        }
    }

    // Fallback if Gemini is unavailable
    private String buildFallbackExplanation(AssessmentRequest request, TriageCategory category) {
        return switch (category) {
            case EMERGENCY -> String.format(
                    "This child (%d months) shows signs that require immediate medical attention. " +
                            "Please refer to the nearest health facility right away. Do not wait.",
                    request.getAgeMonths());
            case URGENT -> String.format(
                    "This child (%d months) needs to be seen by a health worker today. " +
                            "Monitor closely and arrange transport to a facility as soon as possible.",
                    request.getAgeMonths());
            case PRIORITY -> String.format(
                    "This child (%d months) has symptoms that need medical attention soon. " +
                            "Visit a health facility within the next 24 hours.",
                    request.getAgeMonths());
            case GENERAL -> String.format(
                    "This child (%d months) can be monitored at home for now. " +
                            "Ensure rest, hydration, and return if symptoms worsen.",
                    request.getAgeMonths());
        };
    }
}