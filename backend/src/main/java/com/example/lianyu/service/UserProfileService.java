package com.example.lianyu.service;

import com.example.lianyu.model.User;
import com.example.lianyu.model.UserProfile;
import com.example.lianyu.repository.UserProfileRepository;
import com.example.lianyu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    
    // 文件上传目录
    private final String uploadDir = "uploads/photos";

    @Autowired
    public UserProfileService(UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
        
        // 创建上传目录
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public boolean setValidateDucation(String username, int value) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return false;
        }

        User user = userOpt.get();
        Optional<UserProfile> profileOpt = userProfileRepository.findByUser(user);

        UserProfile profile;
        if (profileOpt.isPresent()) {
            profile = profileOpt.get();
        } else {
            profile = new UserProfile(user);
        }

        profile.setValidateDucation(value);
        userProfileRepository.save(profile);
        return true;
    }

    public boolean setValidateId(String username, int value) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return false;
        }

        User user = userOpt.get();
        Optional<UserProfile> profileOpt = userProfileRepository.findByUser(user);

        UserProfile profile;
        if (profileOpt.isPresent()) {
            profile = profileOpt.get();
        } else {
            profile = new UserProfile(user);
        }

        profile.setValidateId(value);
        userProfileRepository.save(profile);
        return true;
    }

    /**
     * 获取用户个人信息
     * @param username 用户名
     * @return 用户个人信息对象
     */
    public UserProfile getUserProfile(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        Optional<UserProfile> profileOpt = userProfileRepository.findByUser(user);
        
        // 如果用户个人信息不存在，则创建一个新的
        if (!profileOpt.isPresent()) {
            UserProfile newProfile = new UserProfile(user);
            return userProfileRepository.save(newProfile);
        }
        
        return profileOpt.get();
    }

    /**
     * 更新用户个人信息
     * @param username 用户名
     * @param name 姓名
     * @param age 年龄
     * @param education 学历
     * @param height 身高
     * @param weight 体重
     * @param photo 照片文件
     * @return 更新后的用户个人信息对象
     */
    /**
     * 获取所有用户的个人信息
     * @return 所有用户的个人信息列表
     */
    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }
    
    /**
     * 更新用户个人信息
     * @param username 用户名
     * @param name 姓名
     * @param age 年龄
     * @param education 学历
     * @param height 身高
     * @param weight 体重
     * @param photo 照片文件
     * @return 更新后的用户个人信息对象
     */
    public UserProfile updateUserProfile(String username, String name, String age, 
                                        String education, String height, String weight, 
                                        String introduction, MultipartFile photo) throws IOException {
        
        UserProfile profile = getUserProfile(username);
        if (profile == null) {
            return null;
        }
        
        // 更新基本信息
        if (name != null && !name.isEmpty()) {
            profile.setName(name);
        }
        
        if (age != null && !age.isEmpty()) {
            try {
                profile.setAge(Integer.parseInt(age));
            } catch (NumberFormatException e) {
                // 忽略无效的数字格式
            }
        }
        
        if (education != null) {
            profile.setEducation(education);
        }
        
        if (height != null && !height.isEmpty()) {
            try {
                profile.setHeight(Integer.parseInt(height));
            } catch (NumberFormatException e) {
                // 忽略无效的数字格式
            }
        }
        
        if (weight != null && !weight.isEmpty()) {
            try {
                profile.setWeight(Integer.parseInt(weight));
            } catch (NumberFormatException e) {
                // 忽略无效的数字格式
            }
        }
        
        // 更新自我介绍
        if (introduction != null) {
            profile.setIntroduction(introduction);
        }
        
        // 处理照片上传
        if (photo != null && !photo.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + photo.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            
            // 保存文件
            Files.write(filePath, photo.getBytes());
            
            // 更新照片URL
            profile.setPhotoUrl("/uploads/photos/" + fileName);
        }
        
        return userProfileRepository.save(profile);
    }
}