package com.swasthyaai.dto;

import lombok.Data;
import java.util.List;

@Data
public class TriageRequest {
    private String patientId;
    private String language;
    private List<String> symptoms;
    private List<String> bodyParts;
    private String voiceTranscript;
    private String duration;
    private String severity;
    private String age;
    private String gender;
    private List<String> conditions;
    private List<String> emergencySigns;
}
