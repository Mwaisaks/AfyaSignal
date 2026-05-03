package com.mwaisaka.AfyaSignal.security;

import com.mwaisaka.AfyaSignal.entity.User;
import com.mwaisaka.AfyaSignal.enums.UserRole;
import com.mwaisaka.AfyaSignal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
            log.info("Demo data seeded successfully");
        }
    }

    private void seedUsers() {
        userRepository.save(User.builder()
                .name("Grace Mwangi")
                .email("chv@afyasignal.com")
                .password(passwordEncoder.encode("demo123"))
                .role(UserRole.CHV)
                .village("Kibera")
                .phone("+254712345678")
                .build());

        userRepository.save(User.builder()
                .name("Dr. James Omondi")
                .email("admin@afyasignal.com")
                .password(passwordEncoder.encode("demo123"))
                .role(UserRole.ADMIN)
                .build());

        userRepository.save(User.builder()
                .name("Nurse Fatuma Ali")
                .email("facility@afyasignal.com")
                .password(passwordEncoder.encode("demo123"))
                .role(UserRole.HEALTH_FACILITY)
                .facility("Kenyatta National Hospital")
                .build());

        log.info("Seeded 3 demo users: chv@afyasignal.com, admin@afyasignal.com, facility@afyasignal.com | password: demo123");
    }
}