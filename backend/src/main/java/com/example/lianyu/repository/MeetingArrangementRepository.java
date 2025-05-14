package com.example.lianyu.repository;

import com.example.lianyu.model.Conversation;
import com.example.lianyu.model.MeetingArrangement;
import com.example.lianyu.model.MeetingPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingArrangementRepository extends JpaRepository<MeetingArrangement, Long> {
    
    /**
     * 根据对话查找约见安排
     * @param conversation 对话
     * @return 约见安排
     */
    Optional<MeetingArrangement> findByConversation(Conversation conversation);
    
    /**
     * 查找特定时间范围内的约见安排
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 约见安排列表
     */
    List<MeetingArrangement> findByMeetingTimeBetween(Date startTime, Date endTime);
    
    /**
     * 查找特定地点的约见安排
     * @param meetingPlace 约见地点
     * @return 约见安排列表
     */
    List<MeetingArrangement> findByMeetingPlace(MeetingPlace meetingPlace);
    
    /**
     * 查找已确认的约见安排
     * @return 已确认的约见安排列表
     */
    List<MeetingArrangement> findByIsConfirmedTrue();
}