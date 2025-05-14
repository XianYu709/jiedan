package com.example.lianyu.repository;

import com.example.lianyu.model.Conversation;
import com.example.lianyu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    /**
     * 查找用户参与的所有对话
     * @param user 用户
     * @return 对话列表
     */
    @Query("SELECT c FROM Conversation c WHERE c.user1 = :user OR c.user2 = :user ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByUserOrderByLastMessageAtDesc(@Param("user") User user);
    
    /**
     * 查找两个用户之间的对话
     * @param user1 用户1
     * @param user2 用户2
     * @return 对话
     */
    @Query("SELECT c FROM Conversation c WHERE (c.user1 = :user1 AND c.user2 = :user2) OR (c.user1 = :user2 AND c.user2 = :user1)")
    Optional<Conversation> findByUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    /**
     * 查找特定类型的对话
     * @param user 用户
     * @param conversationType 对话类型
     * @return 对话列表
     */
    @Query("SELECT c FROM Conversation c WHERE (c.user1 = :user OR c.user2 = :user) AND c.conversationType = :conversationType ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByUserAndConversationTypeOrderByLastMessageAtDesc(@Param("user") User user, @Param("conversationType") String conversationType);
}