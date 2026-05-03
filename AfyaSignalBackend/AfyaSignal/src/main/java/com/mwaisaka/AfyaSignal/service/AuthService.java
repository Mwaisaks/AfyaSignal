package com.mwaisaka.AfyaSignal.service;

import com.mwaisaka.AfyaSignal.dto.AuthResponse;
import com.mwaisaka.AfyaSignal.dto.LoginRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);
}
