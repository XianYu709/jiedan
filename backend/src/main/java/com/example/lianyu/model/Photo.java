package com.example.lianyu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
public class Photo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "album_id")
    private Album album;
    
    @Column(nullable = false)
    private String photoUrl;
    
    @Column
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime uploadedAt;
    
    @Column
    private Integer orderIndex;
    
    // 默认构造函数
    public Photo() {
        this.uploadedAt = LocalDateTime.now();
    }
    
    // 带参数的构造函数
    public Photo(Album album, String photoUrl) {
        this.album = album;
        this.photoUrl = photoUrl;
        this.uploadedAt = LocalDateTime.now();
    }
    
    // 带参数的构造函数
    public Photo(Album album, String photoUrl, String description) {
        this.album = album;
        this.photoUrl = photoUrl;
        this.description = description;
        this.uploadedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Album getAlbum() {
        return album;
    }
    
    public void setAlbum(Album album) {
        this.album = album;
    }
    
    public String getPhotoUrl() {
        return photoUrl;
    }
    
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}