package com.mwaisaka.AfyaSignal.security;

import com.mwaisaka.AfyaSignal.entity.Alert;
import com.mwaisaka.AfyaSignal.entity.Assessment;
import com.mwaisaka.AfyaSignal.entity.Facility;
import com.mwaisaka.AfyaSignal.entity.User;
import com.mwaisaka.AfyaSignal.enums.AlertStatus;
import com.mwaisaka.AfyaSignal.enums.TriageCategory;
import com.mwaisaka.AfyaSignal.enums.UserRole;
import com.mwaisaka.AfyaSignal.repository.AlertRepository;
import com.mwaisaka.AfyaSignal.repository.AssessmentRepository;
import com.mwaisaka.AfyaSignal.repository.FacilityRepository;
import com.mwaisaka.AfyaSignal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@ConditionalOnProperty(name = "app.demo-data.enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;
    private final AssessmentRepository assessmentRepository;
    private final AlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        DemoUsers users = seedUsers();

        if (facilityRepository.count() == 0) {
            seedFacilities(users.facilityManager());
        }

        if (assessmentRepository.count() == 0) {
            seedAssessments(users.chv());
        }

        if (alertRepository.count() == 0) {
            seedAlerts();
        }

        log.info("Demo data ready");
    }

    private DemoUsers seedUsers() {
        User chv = getOrCreateUser(
                "chv@afyasignal.com",
                User.builder()
                .name("Grace Mwangi")
                .email("chv@afyasignal.com")
                .password(passwordEncoder.encode("demo123"))
                .role(UserRole.CHV)
                .village("Kibera")
                .phone("+254712345678")
                .build()
        );

        User admin = getOrCreateUser(
                "admin@afyasignal.com",
                User.builder()
                .name("Dr. James Omondi")
                .email("admin@afyasignal.com")
                .password(passwordEncoder.encode("demo123"))
                .role(UserRole.ADMIN)
                .build()
        );

        User facilityManager = getOrCreateUser(
                "facility@afyasignal.com",
                User.builder()
                .name("Nurse Fatuma Ali")
                .email("facility@afyasignal.com")
                .password(passwordEncoder.encode("demo123"))
                .role(UserRole.HEALTH_FACILITY)
                .facility("Kenyatta National Hospital")
                .build()
        );

        log.info("Seeded 3 demo users: chv@afyasignal.com, admin@afyasignal.com, facility@afyasignal.com | password: demo123");
        return new DemoUsers(chv, admin, facilityManager);
    }

    private User getOrCreateUser(String email, User user) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(user));
    }

    private void seedFacilities(User facilityManager) {
        facilityRepository.save(Facility.builder()
                .name("Kibera South Health Centre")
                .village("Kibera")
                .subCounty("Langata")
                .phone("+254700111222")
                .totalBeds(24)
                .availableBeds(6)
                .operatingHours("24 hours")
                .manager(facilityManager)
                .build());

        facilityRepository.save(Facility.builder()
                .name("Laini Saba Dispensary")
                .village("Laini Saba")
                .subCounty("Langata")
                .phone("+254700333444")
                .totalBeds(10)
                .availableBeds(3)
                .operatingHours("8:00 AM - 6:00 PM")
                .manager(facilityManager)
                .build());

        facilityRepository.save(Facility.builder()
                .name("Kenyatta National Hospital")
                .village("Upper Hill")
                .subCounty("Dagoretti North")
                .phone("+254711000000")
                .totalBeds(1800)
                .availableBeds(120)
                .operatingHours("24 hours")
                .manager(facilityManager)
                .build());

        log.info("Seeded demo health facilities");
    }

    private void seedAssessments(User chv) {
        Assessment emergencyCase = Assessment.builder()
                .childId("CHILD-DEMO-0001")
                .childName("Amina Otieno")
                .ageMonths(18)
                .parentName("Mary Otieno")
                .parentPhone("+254722111000")
                .village("Kibera")
                .weight(9.8)
                .fever(true)
                .feverDays(5)
                .difficultyBreathing(true)
                .lethargy(true)
                .temperature(39.2)
                .respiratoryRate(48)
                .triageCategory(TriageCategory.EMERGENCY)
                .triageExplanation("The child has danger signs including lethargy, high fever, and difficulty breathing. Refer immediately to the nearest health facility.")
                .referralReason("Danger signs present")
                .chv(chv)
                .build();

        Assessment urgentCase = Assessment.builder()
                .childId("CHILD-DEMO-0002")
                .childName("Brian Mwangi")
                .ageMonths(10)
                .parentName("Peter Mwangi")
                .parentPhone("+254722222000")
                .village("Kibera")
                .weight(8.4)
                .fever(true)
                .feverDays(3)
                .diarrhea(true)
                .diarrheaDays(2)
                .vomiting(true)
                .temperature(38.4)
                .triageCategory(TriageCategory.URGENT)
                .triageExplanation("The child has fever, diarrhea, and vomiting, which can lead to dehydration. Arrange same-day review by a health worker.")
                .referralReason("Same-day assessment needed")
                .chv(chv)
                .build();

        Assessment priorityCase = Assessment.builder()
                .childId("CHILD-DEMO-0003")
                .childName("Neema Wanjiku")
                .ageMonths(30)
                .parentName("Lucy Wanjiku")
                .parentPhone("+254722333000")
                .village("Laini Saba")
                .weight(12.1)
                .cough(true)
                .coughDays(2)
                .fever(true)
                .feverDays(1)
                .temperature(37.9)
                .triageCategory(TriageCategory.PRIORITY)
                .triageExplanation("The child has mild fever and cough. Review soon and return earlier if breathing worsens or fever persists.")
                .chv(chv)
                .build();

        Assessment generalCase = Assessment.builder()
                .childId("CHILD-DEMO-0004")
                .childName("Hassan Ali")
                .ageMonths(42)
                .parentName("Asha Ali")
                .parentPhone("+254722444000")
                .village("Laini Saba")
                .weight(14.3)
                .rash(true)
                .triageCategory(TriageCategory.GENERAL)
                .triageExplanation("The child has no immediate danger signs. Monitor at home and seek care if symptoms worsen.")
                .chv(chv)
                .build();

        assessmentRepository.save(emergencyCase);
        assessmentRepository.save(urgentCase);
        assessmentRepository.save(priorityCase);
        assessmentRepository.save(generalCase);

        log.info("Seeded demo child assessments");
    }

    private void seedAlerts() {
        alertRepository.save(Alert.builder()
                .type("SYMPTOM_CLUSTER")
                .village("Kibera")
                .message("Multiple children in Kibera have reported fever and respiratory symptoms within the current reporting window.")
                .caseCount(4)
                .dayWindow(7)
                .status(AlertStatus.NEW)
                .build());

        alertRepository.save(Alert.builder()
                .type("LOW_BED_CAPACITY")
                .village("Laini Saba")
                .message("Nearby facilities have limited available beds. Prioritize urgent referrals and confirm capacity before transfer.")
                .caseCount(2)
                .dayWindow(3)
                .status(AlertStatus.ACKNOWLEDGED)
                .build());

        log.info("Seeded demo alerts");
    }

    private record DemoUsers(User chv, User admin, User facilityManager) {
    }
}
