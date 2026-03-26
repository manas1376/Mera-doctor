package com.swasthyaai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentInfo {
    private String doctorName;
    private String date;
    private String slot;
    private String bookingId;
}
