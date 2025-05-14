package com.example.lianyu.service;

import com.example.lianyu.model.User;
import com.example.lianyu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 注册新用户
     * @param username 用户名
     * @param password 密码
     * @return 注册成功返回用户对象，失败返回null
     */
    public User register(String username, String password) {
        // 检查用户名是否已存在
        if (userRepository.existsByUsername(username)) {
            return null;
        }
        
        // 创建新用户并保存
        User user = new User(username, password);
        return userRepository.save(user);
    }

    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return 登录成功返回用户对象，失败返回null
     */
    public User login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // 验证密码
            if (password.equals(user.getPassword())) {
                return user;
            }
        }
        
        return null;
    }
    
    /**
     * 修改用户密码
     * @param username 用户名
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 修改成功返回true，失败返回false
     */
    public boolean changePassword(String username, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // 验证旧密码
            if (oldPassword.equals(user.getPassword())) {
                // 更新密码
                user.setPassword(newPassword);
                userRepository.save(user);
                return true;
            }
        }
        
        return false;
    }
}