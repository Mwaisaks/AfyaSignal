package com.mwaisaka.AfyaSignal.dto;

import com.mwaisaka.AfyaSignal.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UUID id;
    private String name;
    private String email;
    private UserRole role;
    private String village;
    private String facility;
}