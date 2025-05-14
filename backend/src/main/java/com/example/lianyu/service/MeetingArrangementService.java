package com.example.lianyu.service;

import com.example.lianyu.model.Conversation;
import com.example.lianyu.model.MeetingArrangement;
import com.example.lianyu.model.MeetingPlace;
import com.example.lianyu.model.TimeSlot;
import com.example.lianyu.model.User;
import com.example.lianyu.repository.ConversationRepository;
import com.example.lianyu.repository.MeetingArrangementRepository;
import com.example.lianyu.repository.MeetingPlaceRepository;
import com.example.lianyu.repository.TimeSlotRepository;
import com.example.lianyu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MeetingArrangementService {

    private final MeetingArrangementRepository meetingArrangementRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final MeetingPlaceRepository meetingPlaceRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    @Autowired
    public MeetingArrangementService(MeetingArrangementRepository meetingArrangementRepository,
                                    TimeSlotRepository timeSlotRepository,
                                    MeetingPlaceRepository meetingPlaceRepository,
                                    ConversationRepository conversationRepository,
                                    UserRepository userRepository) {
        this.meetingArrangementRepository = meetingArrangementRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.meetingPlaceRepository = meetingPlaceRepository;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    /**
     * 获取对话的约见安排
     * @param conversationId 对话ID
     * @return 约见安排
     */
    public MeetingArrangement getMeetingArrangement(Long conversationId) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (!conversationOpt.isPresent()) {
            return null;
        }
        
        Conversation conversation = conversationOpt.get();
        Optional<MeetingArrangement> arrangementOpt = meetingArrangementRepository.findByConversation(conversation);
        
        return arrangementOpt.orElse(null);
    }

    /**
     * 自动安排约见
     * 根据双方提交的时间段，找出重叠的时间，并安排在万达广场见面
     * @param conversationId 对话ID
     * @return 创建的约见安排
     */
    @Transactional
    public MeetingArrangement autoArrangeMeeting(Long conversationId) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        
        if (!conversationOpt.isPresent()) {
            return null;
        }
        
        Conversation conversation = conversationOpt.get();
        
        // 检查是否已有约见安排
        Optional<MeetingArrangement> existingArrangementOpt = meetingArrangementRepository.findByConversation(conversation);
        if (existingArrangementOpt.isPresent()) {
            return existingArrangementOpt.get();
        }
        
        // 查找重叠的时间段
        User user1 = conversation.getUser1();
        User user2 = conversation.getUser2();
        List<TimeSlot> overlappingSlots = timeSlotRepository.findOverlappingTimeSlots(conversation, user1, user2);
        
        if (overlappingSlots.isEmpty()) {
            return null; // 没有重叠的时间段
        }
        
        // 选择第一个重叠的时间段
        TimeSlot selectedSlot = overlappingSlots.get(0);
        
        // 标记该时间段为已选择
        selectedSlot.setSelected(true);
        timeSlotRepository.save(selectedSlot);
        
        // 获取万达广场作为约见地点
        MeetingPlace meetingPlace = meetingPlaceRepository.findByName("万达广场");
        
        // 如果万达广场不存在，创建一个
        if (meetingPlace == null) {
            meetingPlace = new MeetingPlace("万达广场", "城市中心", "购物中心，有多个入口，建议在一楼中庭见面");
            meetingPlace = meetingPlaceRepository.save(meetingPlace);
        }
        
        // 创建约见安排
        MeetingArrangement arrangement = new MeetingArrangement(conversation, meetingPlace, selectedSlot.getStartTime());
        arrangement.setConfirmed(true); // 自动确认
        
        return meetingArrangementRepository.save(arrangement);
    }

    /**
     * 确认约见安排
     * @param arrangementId 约见安排ID
     * @param username 用户名（确保用户是对话参与者）
     * @return 是否成功确认
     */
    @Transactional
    public boolean confirmMeetingArrangement(Long arrangementId, String username) {
        Optional<MeetingArrangement> arrangementOpt = meetingArrangementRepository.findById(arrangementId);
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (!arrangementOpt.isPresent() || !userOpt.isPresent()) {
            return false;
        }
        
        MeetingArrangement arrangement = arrangementOpt.get();
        User user = userOpt.get();
        Conversation conversation = arrangement.getConversation();
        
        // 确保用户是对话参与者
        if (!conversation.getUser1().getId().equals(user.getId()) && !conversation.getUser2().getId().equals(user.getId())) {
            return false;
        }
        
        arrangement.setConfirmed(true);
        meetingArrangementRepository.save(arrangement);
        return true;
    }

    /**
     * 取消约见安排
     * @param arrangementId 约见安排ID
     * @param username 用户名（确保用户是对话参与者）
     * @return 是否成功取消
     */
    @Transactional
    public boolean cancelMeetingArrangement(Long arrangementId, String username) {
        Optional<MeetingArrangement> arrangementOpt = meetingArrangementRepository.findById(arrangementId);
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (!arrangementOpt.isPresent() || !userOpt.isPresent()) {
            return false;
        }
        
        MeetingArrangement arrangement = arrangementOpt.get();
        User user = userOpt.get();
        Conversation conversation = arrangement.getConversation();
        
        // 确保用户是对话参与者
        if (!conversation.getUser1().getId().equals(user.getId()) && !conversation.getUser2().getId().equals(user.getId())) {
            return false;
        }
        
        meetingArrangementRepository.delete(arrangement);
        return true;
    }
}