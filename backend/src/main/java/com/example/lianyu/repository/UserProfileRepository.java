package com.example.lianyu.repository;

import com.example.lianyu.model.UserProfile;
import com.example.lianyu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
    /**
     * 根据用户查找用户个人信息
     * @param user 用户对象
     * @return 用户个人信息对象
     */
    Optional<UserProfile> findByUser(User user);
}