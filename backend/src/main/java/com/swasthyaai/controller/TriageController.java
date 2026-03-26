package com.swasthyaai.controller;

import com.swasthyaai.dto.TriageRequest;
import com.swasthyaai.dto.TriageResponse;
import com.swasthyaai.service.TriageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/triage")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TriageController {

    private final TriageService triageService;

    /**
     * POST /api/v1/triage/analyze
     * Analyze symptoms and return triage result
     */
    @PostMapping("/analyze")
    public ResponseEntity<TriageResponse> analyze(@RequestBody TriageRequest request) {
        TriageResponse result = triageService.analyze(request);
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/v1/triage/save
     * Save triage session to MongoDB
     */
    @PostMapping("/save")
    public ResponseEntity<String> saveSession(@RequestBody TriageRequest request) {
        String sessionId = triageService.saveSession(request);
        return ResponseEntity.ok(sessionId);
    }
}
