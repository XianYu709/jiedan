package com.example.lianyu.controller;

import com.example.lianyu.model.UserProfile;
import com.example.lianyu.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Autowired
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    /**
     * 获取用户个人信息
     * @param username 用户名
     * @return 用户个人信息
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Username") String username) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        UserProfile profile = userProfileService.getUserProfile(username);
        
        if (profile == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户不存在");
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(profile);
    }
    
    /**
     * 获取所有用户的个人信息（用于浏览功能）
     * @return 所有用户的个人信息列表
     */
    @GetMapping("/all-profiles")
    public ResponseEntity<?> getAllUserProfiles() {
        List<UserProfile> profiles = userProfileService.getAllUserProfiles();
        return ResponseEntity.ok(profiles);
    }

    /**
     * 更新用户个人信息
     * @param username 用户名
     * @param name 姓名
     * @param age 年龄
     * @param education 学历
     * @param height 身高
     * @param weight 体重
     * @param photo 照片
     * @return 更新结果
     */
    @PostMapping("/profile")
    public ResponseEntity<?> updateUserProfile(
            @RequestHeader("Username") String username,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "age", required = false) String age,
            @RequestParam(value = "education", required = false) String education,
            @RequestParam(value = "height", required = false) String height,
            @RequestParam(value = "weight", required = false) String weight,
            @RequestParam(value = "introduction", required = false) String introduction,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {
        
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            UserProfile updatedProfile = userProfileService.updateUserProfile(
                    username, name, age, education, height, weight, introduction, photo);
            
            if (updatedProfile == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "用户不存在");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "个人信息更新成功");
            response.put("profile", updatedProfile);
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "文件上传失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}