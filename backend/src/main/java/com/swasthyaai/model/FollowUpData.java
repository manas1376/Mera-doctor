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
public class FollowUpData {
    private String duration;
    private String severity;
    private String age;
    private String gender;
    private List<String> conditions;
    private List<String> emergencySigns;
}
