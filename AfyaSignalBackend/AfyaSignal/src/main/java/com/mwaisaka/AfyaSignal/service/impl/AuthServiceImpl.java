package com.mwaisaka.AfyaSignal.service.impl;

import com.mwaisaka.AfyaSignal.dto.AuthResponse;
import com.mwaisaka.AfyaSignal.dto.LoginRequest;
import com.mwaisaka.AfyaSignal.entity.User;
import com.mwaisaka.AfyaSignal.mapper.UserMapper;
import com.mwaisaka.AfyaSignal.repository.UserRepository;
import com.mwaisaka.AfyaSignal.security.JwtService;
import com.mwaisaka.AfyaSignal.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        AuthResponse response = userMapper.toAuthResponse(user);
        response.setToken(token);
        return response;
    }
}