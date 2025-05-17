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
     *
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
     *
     * @return 所有用户的个人信息列表
     */
    @GetMapping("/all-profiles")
    public ResponseEntity<?> getAllUserProfiles() {
        List<UserProfile> profiles = userProfileService.getAllUserProfiles();
        return ResponseEntity.ok(profiles);
    }

    @PostMapping("/setFieldValue")
    public ResponseEntity<?> setFieldValue(
            @RequestHeader("Username") String username,
            @RequestBody Map<String, Object> requestBody) {

        Integer value = (Integer) requestBody.get("value");
        String field = String.valueOf(requestBody.get("field"));
        Map<String, Object> response = new HashMap<>();


        // 验证参数
        if (username == null || username.isEmpty()) {
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        if (field == null || field.isEmpty()) {
            response.put("message", "field不能为空");
            return ResponseEntity.badRequest().body(response);
        }

        if (value == null || (value != 0 && value != 1)) {
            response.put("message", "value仅允许设置为 0 或 1");
            return ResponseEntity.badRequest().body(response);
        }

        boolean success=false;

        if (field.equals("education")) {
            success = userProfileService.setValidateDucation(username, value);
        }
        if (field.equals("id")) {
            success = userProfileService.setValidateId(username, value);
        }

        // 调用业务逻辑层设置
        if (success) {
            response.put("message", "设置成功");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "用户不存在或更新失败");
            return ResponseEntity.badRequest().body(response);
        }
    }


    /**
     * 更新用户个人信息
     *
     * @param username  用户名
     * @param name      姓名
     * @param age       年龄
     * @param education 学历
     * @param height    身高
     * @param weight    体重
     * @param photo     照片
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