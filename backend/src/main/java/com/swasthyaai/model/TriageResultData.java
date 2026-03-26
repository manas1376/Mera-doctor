package com.swasthyaai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TriageResultData {
    private String riskLevel;
    private Integer riskScore;
    private String summary;
    private List<String> recommendations;
    private String urgency;
}
