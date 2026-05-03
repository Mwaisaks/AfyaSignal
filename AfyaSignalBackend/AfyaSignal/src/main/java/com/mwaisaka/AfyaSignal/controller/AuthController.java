package com.mwaisaka.AfyaSignal.controller;

import com.mwaisaka.AfyaSignal.dto.AuthResponse;
import com.mwaisaka.AfyaSignal.dto.LoginRequest;
import com.mwaisaka.AfyaSignal.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}