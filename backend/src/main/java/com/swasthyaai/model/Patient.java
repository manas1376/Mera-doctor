package com.swasthyaai.model;

import lombok.Data;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Document(collection = "patients")
public class Patient {
    @Id
    private String id;
    private String patientCode;       // PAT-XXXXX
    private String aadhaarHash;       // SHA-256 hashed, never store raw
    private String preferredLanguage;
    private LocalDateTime createdAt;
    private LocalDateTime lastVisit;

    // Latest session summary
    private List<String> symptoms;
    private List<String> bodyParts;
    private FollowUpData followUpData;
    private TriageResult triageResult;
    private AppointmentInfo appointment;
}
