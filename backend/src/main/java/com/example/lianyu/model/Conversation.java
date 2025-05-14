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
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "conversations")
public class Conversation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user1_id", referencedColumnName = "id")
    private User user1;
    
    @ManyToOne
    @JoinColumn(name = "user2_id", referencedColumnName = "id")
    private User user2;
    
    @Column(nullable = false)
    private String conversationType; // "MEET" 约见类型
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createdAt;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastMessageAt;
    
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ConversationMessage> messages = new ArrayList<>();
    
    // 默认构造函数
    public Conversation() {
        this.createdAt = new Date();
        this.lastMessageAt = new Date();
    }
    
    // 带参数的构造函数
    public Conversation(User user1, User user2, String conversationType) {
        this.user1 = user1;
        this.user2 = user2;
        this.conversationType = conversationType;
        this.createdAt = new Date();
        this.lastMessageAt = new Date();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser1() {
        return user1;
    }
    
    public void setUser1(User user1) {
        this.user1 = user1;
    }
    
    public User getUser2() {
        return user2;
    }
    
    public void setUser2(User user2) {
        this.user2 = user2;
    }
    
    public String getConversationType() {
        return conversationType;
    }
    
    public void setConversationType(String conversationType) {
        this.conversationType = conversationType;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getLastMessageAt() {
        return lastMessageAt;
    }
    
    public void setLastMessageAt(Date lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }
    
    public List<ConversationMessage> getMessages() {
        return messages;
    }
    
    public void setMessages(List<ConversationMessage> messages) {
        this.messages = messages;
    }
    
    public void addMessage(ConversationMessage message) {
        this.messages.add(message);
        this.lastMessageAt = new Date();
    }
}