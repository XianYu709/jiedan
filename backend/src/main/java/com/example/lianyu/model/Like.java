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
import jakarta.persistence.UniqueConstraint;

import java.util.Date;

@Entity
@Table(name = "likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"liker_id", "liked_id"})
})
public class Like {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "liker_id", referencedColumnName = "id")
    private User liker; // 发起喜欢的用户
    
    @ManyToOne
    @JoinColumn(name = "liked_id", referencedColumnName = "id")
    private User liked; // 被喜欢的用户
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createdAt;
    
    // 默认构造函数
    public Like() {
        this.createdAt = new Date();
    }
    
    // 带参数的构造函数
    public Like(User liker, User liked) {
        this.liker = liker;
        this.liked = liked;
        this.createdAt = new Date();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getLiker() {
        return liker;
    }
    
    public void setLiker(User liker) {
        this.liker = liker;
    }
    
    public User getLiked() {
        return liked;
    }
    
    public void setLiked(User liked) {
        this.liked = liked;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}