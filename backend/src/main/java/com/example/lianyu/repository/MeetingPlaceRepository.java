package com.example.lianyu.repository;

import com.example.lianyu.model.MeetingPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingPlaceRepository extends JpaRepository<MeetingPlace, Long> {
    
    /**
     * 根据名称查找约见地点
     * @param name 地点名称
     * @return 约见地点
     */
    MeetingPlace findByName(String name);
}