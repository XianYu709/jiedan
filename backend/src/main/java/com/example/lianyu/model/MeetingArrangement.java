package com.example.lianyu.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.util.Date;

@Entity
@Table(name = "meeting_arrangements")
public class MeetingArrangement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "conversation_id", referencedColumnName = "id")
    private Conversation conversation;
    
    @ManyToOne
    @JoinColumn(name = "meeting_place_id", referencedColumnName = "id")
    private MeetingPlace meetingPlace;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date meetingTime;
    
    @Column(nullable = false)
    private boolean isConfirmed = false;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createdAt;
    
    // 默认构造函数
    public MeetingArrangement() {
        this.createdAt = new Date();
    }
    
    // 带参数的构造函数
    public MeetingArrangement(Conversation conversation, MeetingPlace meetingPlace, Date meetingTime) {
        this.conversation = conversation;
        this.meetingPlace = meetingPlace;
        this.meetingTime = meetingTime;
        this.createdAt = new Date();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Conversation getConversation() {
        return conversation;
    }
    
    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }
    
    public MeetingPlace getMeetingPlace() {
        return meetingPlace;
    }
    
    public void setMeetingPlace(MeetingPlace meetingPlace) {
        this.meetingPlace = meetingPlace;
    }
    
    public Date getMeetingTime() {
        return meetingTime;
    }
    
    public void setMeetingTime(Date meetingTime) {
        this.meetingTime = meetingTime;
    }
    
    public boolean isConfirmed() {
        return isConfirmed;
    }
    
    public void setConfirmed(boolean confirmed) {
        isConfirmed = confirmed;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}