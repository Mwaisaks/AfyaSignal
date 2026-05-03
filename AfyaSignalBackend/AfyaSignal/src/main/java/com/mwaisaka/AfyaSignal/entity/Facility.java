package com.mwaisaka.AfyaSignal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "facilities")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String village;

    @Column(nullable = false)
    private String subCounty;

    private String phone;
    private Integer totalBeds;
    private Integer availableBeds;
    private String operatingHours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;
}