package com.example.lianyu.service;

import com.example.lianyu.model.Conversation;
import com.example.lianyu.model.TimeSlot;
import com.example.lianyu.model.User;
import com.example.lianyu.repository.ConversationRepository;
import com.example.lianyu.repository.TimeSlotRepository;
import com.example.lianyu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;

    @Autowired
    public TimeSlotService(TimeSlotRepository timeSlotRepository, UserRepository userRepository,
                          ConversationRepository conversationRepository) {
        this.timeSlotRepository = timeSlotRepository;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
    }

    /**
     * 提交用户在特定对话中的可用时间段
     * @param username 用户名
     * @param conversationId 对话ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 创建的时间段
     */
    @Transactional
    public TimeSlot submitTimeSlot(String username, Long conversationId, Date startTime, Date endTime) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (!userOpt.isPresent() || !conversationOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        Conversation conversation = conversationOpt.get();
        
        // 确保用户是对话的参与者
        if (!conversation.getUser1().getId().equals(user.getId()) && !conversation.getUser2().getId().equals(user.getId())) {
            return null;
        }
        
        // 创建新的时间段
        TimeSlot timeSlot = new TimeSlot(user, conversation, startTime, endTime);
        return timeSlotRepository.save(timeSlot);
    }

    /**
     * 获取用户在特定对话中提交的所有时间段
     * @param username 用户名
     * @param conversationId 对话ID
     * @return 时间段列表
     */
    public List<TimeSlot> getUserTimeSlots(String username, Long conversationId) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (!userOpt.isPresent() || !conversationOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        Conversation conversation = conversationOpt.get();
        
        return timeSlotRepository.findByUserAndConversation(user, conversation);
    }

    /**
     * 删除用户的时间段
     * @param username 用户名
     * @param timeSlotId 时间段ID
     * @return 是否成功删除
     */
    @Transactional
    public boolean deleteTimeSlot(String username, Long timeSlotId) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<TimeSlot> timeSlotOpt = timeSlotRepository.findById(timeSlotId);
        
        if (!userOpt.isPresent() || !timeSlotOpt.isPresent()) {
            return false;
        }
        
        User user = userOpt.get();
        TimeSlot timeSlot = timeSlotOpt.get();
        
        // 确保只有时间段的创建者可以删除
        if (!timeSlot.getUser().getId().equals(user.getId())) {
            return false;
        }
        
        timeSlotRepository.delete(timeSlot);
        return true;
    }

    /**
     * 查找两个用户在对话中的重叠时间段
     * @param conversationId 对话ID
     * @return 重叠的时间段列表
     */
    public List<TimeSlot> findOverlappingTimeSlots(Long conversationId) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (!conversationOpt.isPresent()) {
            return null;
        }
        
        Conversation conversation = conversationOpt.get();
        User user1 = conversation.getUser1();
        User user2 = conversation.getUser2();
        
        return timeSlotRepository.findOverlappingTimeSlots(conversation, user1, user2);
    }

    /**
     * 清除对话中的所有时间段
     * @param conversationId 对话ID
     * @return 是否成功清除
     */
    @Transactional
    public boolean clearConversationTimeSlots(Long conversationId) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (!conversationOpt.isPresent()) {
            return false;
        }
        
        Conversation conversation = conversationOpt.get();
        timeSlotRepository.deleteByConversation(conversation);
        return true;
    }
    
    /**
     * 删除用户在特定对话中的所有时间段
     * @param username 用户名
     * @param conversationId 对话ID
     * @return 是否成功删除
     */
    @Transactional
    public boolean deleteAllTimeSlots(String username, Long conversationId) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (!userOpt.isPresent() || !conversationOpt.isPresent()) {
            return false;
        }
        
        User user = userOpt.get();
        Conversation conversation = conversationOpt.get();
        
        // 确保用户是对话的参与者
        if (!conversation.getUser1().getId().equals(user.getId()) && !conversation.getUser2().getId().equals(user.getId())) {
            return false;
        }
        
        // 删除该用户在此对话中的所有时间段
        timeSlotRepository.deleteByUserAndConversation(user, conversation);
        return true;
    }
}