package com.example.lianyu.controller;

import com.example.lianyu.model.Like;
import com.example.lianyu.model.UserProfile;
import com.example.lianyu.service.LikeService;
import com.example.lianyu.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin
public class LikeController {

    private final LikeService likeService;
    private final UserProfileService userProfileService;

    @Autowired
    public LikeController(LikeService likeService, UserProfileService userProfileService) {
        this.likeService = likeService;
        this.userProfileService = userProfileService;
    }

    /**
     * 发送喜欢
     * @param username 当前用户名
     * @param likedUsername 被喜欢的用户名
     * @return 操作结果
     */
    @PostMapping("/send/{likedUsername}")
    public ResponseEntity<?> sendLike(
            @RequestHeader("Username") String username,
            @PathVariable("likedUsername") String likedUsername) {
        
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        Like like = likeService.sendLike(username, likedUsername);
        
        Map<String, Object> response = new HashMap<>();
        if (like != null) {
            boolean isMutual = likeService.checkMutualLike(username, likedUsername);
            response.put("message", "喜欢成功");
            response.put("like", like);
            response.put("isMutual", isMutual);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "喜欢失败");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 取消喜欢
     * @param username 当前用户名
     * @param likedUsername 被喜欢的用户名
     * @return 操作结果
     */
    @DeleteMapping("/cancel/{likedUsername}")
    public ResponseEntity<?> cancelLike(
            @RequestHeader("Username") String username,
            @PathVariable("likedUsername") String likedUsername) {
        
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean success = likeService.cancelLike(username, likedUsername);
        
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "取消喜欢成功");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "取消喜欢失败");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 检查是否喜欢
     * @param username 当前用户名
     * @param likedUsername 被喜欢的用户名
     * @return 是否喜欢
     */
    @GetMapping("/check/{likedUsername}")
    public ResponseEntity<?> checkLike(
            @RequestHeader("Username") String username,
            @PathVariable("likedUsername") String likedUsername) {
        
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean isLiked = likeService.checkLike(username, likedUsername);
        boolean isMutual = likeService.checkMutualLike(username, likedUsername);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        response.put("isMutual", isMutual);
        return ResponseEntity.ok(response);
    }

    /**
     * 获取用户喜欢的用户列表
     * @param username 当前用户名
     * @return 喜欢的用户列表
     */
    @GetMapping("/liked-users")
    public ResponseEntity<?> getLikedUsers(@RequestHeader("Username") String username) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<Like> likes = likeService.getLikedUsers(username);
        return ResponseEntity.ok(likes);
    }

    /**
     * 获取喜欢用户的用户列表
     * @param username 当前用户名
     * @return 喜欢该用户的用户列表
     */
    @GetMapping("/liked-by-users")
    public ResponseEntity<?> getLikedByUsers(@RequestHeader("Username") String username) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<Like> likes = likeService.getLikedByUsers(username);
        return ResponseEntity.ok(likes);
    }
    
    /**
     * 获取喜欢用户的个人信息
     * @param username 当前用户名
     * @param likerUsername 喜欢用户的用户名
     * @return 用户个人信息
     */
    @GetMapping("/liker-profile/{likerUsername}")
    public ResponseEntity<?> getLikerProfile(
            @RequestHeader("Username") String username,
            @PathVariable("likerUsername") String likerUsername) {
        
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        UserProfile profile = userProfileService.getUserProfile(likerUsername);
        
        if (profile == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户不存在");
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(profile);
    }
}