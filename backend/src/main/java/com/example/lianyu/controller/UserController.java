package com.example.lianyu.controller;

import com.example.lianyu.model.User;
import com.example.lianyu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 用户注册
     * @param request 包含用户名和密码的请求
     * @return 注册结果
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        
        if (username == null || password == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名和密码不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        User user = userService.register(username, password);
        
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名已存在");
            return ResponseEntity.badRequest().body(response);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "注册成功");
        response.put("username", user.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * 用户登录
     * @param request 包含用户名和密码的请求
     * @return 登录结果
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        
        if (username == null || password == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名和密码不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        User user = userService.login(username, password);
        
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名或密码错误");
            return ResponseEntity.badRequest().body(response);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "登录成功");
        response.put("username", user.getUsername());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 修改用户密码
     * @param request 包含旧密码和新密码的请求
     * @param username 用户名（从请求头获取）
     * @return 修改结果
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, 
                                          @RequestHeader("Username") String username) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        
        if (oldPassword == null || newPassword == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "旧密码和新密码不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        // 验证新密码复杂度
        if (newPassword.length() < 8) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "新密码长度至少为8个字符");
            return ResponseEntity.badRequest().body(response);
        }
        
        // 检查新密码是否包含大小写字母、数字和特殊字符
        boolean hasUpperCase = false;
        boolean hasLowerCase = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        
        for (char c : newPassword.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpperCase = true;
            else if (Character.isLowerCase(c)) hasLowerCase = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else hasSpecial = true;
        }
        
        if (!(hasUpperCase && hasLowerCase && hasDigit && hasSpecial)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "新密码必须包含大小写字母、数字和特殊字符");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean success = userService.changePassword(username, oldPassword, newPassword);
        
        if (!success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "旧密码不正确");
            return ResponseEntity.badRequest().body(response);
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "密码修改成功");
        return ResponseEntity.ok(response);
    }
}