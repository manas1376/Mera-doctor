package com.swasthyaai.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class TriageResponse {
    private String riskLevel;
    private Integer riskScore;
    private String summary;
    private List<String> recommendations;
    private String urgency;
    private String reasoning;
}
