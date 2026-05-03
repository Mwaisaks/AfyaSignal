package com.mwaisaka.AfyaSignal.repository;

import com.mwaisaka.AfyaSignal.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, UUID> {
    List<Facility> findBySubCounty(String subCounty);
    List<Facility> findByVillage(String village);
}