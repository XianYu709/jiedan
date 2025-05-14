package com.example.lianyu.repository;

import com.example.lianyu.model.Conversation;
import com.example.lianyu.model.TimeSlot;
import com.example.lianyu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    
    /**
     * 查找用户在特定对话中的所有时间段
     * @param user 用户
     * @param conversation 对话
     * @return 时间段列表
     */
    List<TimeSlot> findByUserAndConversation(User user, Conversation conversation);
    
    /**
     * 查找对话中的所有时间段
     * @param conversation 对话
     * @return 时间段列表
     */
    List<TimeSlot> findByConversation(Conversation conversation);
    
    /**
     * 查找两个用户在同一对话中的重叠时间段
     * @param conversation 对话
     * @param user1 用户1
     * @param user2 用户2
     * @return 重叠的时间段列表
     */
    @Query("SELECT t1 FROM TimeSlot t1, TimeSlot t2 WHERE " +
           "t1.conversation = :conversation AND t2.conversation = :conversation AND " +
           "t1.user = :user1 AND t2.user = :user2 AND " +
           "t1.startTime < t2.endTime AND t1.endTime > t2.startTime " +
           "ORDER BY t1.startTime ASC")
    List<TimeSlot> findOverlappingTimeSlots(
            @Param("conversation") Conversation conversation,
            @Param("user1") User user1,
            @Param("user2") User user2);
    
    /**
     * 删除用户在特定对话中的所有时间段
     * @param user 用户
     * @param conversation 对话
     */
    void deleteByUserAndConversation(User user, Conversation conversation);
    
    /**
     * 删除对话中的所有时间段
     * @param conversation 对话
     */
    void deleteByConversation(Conversation conversation);
    
    /**
     * 查找用户在特定时间范围内的时间段
     * @param user 用户
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 时间段列表
     */
    List<TimeSlot> findByUserAndStartTimeGreaterThanEqualAndEndTimeLessThanEqual(
            User user, Date startTime, Date endTime);
    

}