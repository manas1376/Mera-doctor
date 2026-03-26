package com.swasthyaai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "triage_sessions")
public class TriageSession {
    @Id
    private String id;
    private String patientCode;
    private String language;
    private List<String> symptoms;
    private List<String> bodyParts;
    private String voiceTranscript;
    private FollowUpData followUpData;
    private TriageResultData triageResult;
    private LocalDateTime sessionDate;
}
