package com.example.lianyu.service;

import com.example.lianyu.model.Conversation;
import com.example.lianyu.model.Like;
import com.example.lianyu.model.Message;
import com.example.lianyu.model.User;
import com.example.lianyu.repository.ConversationRepository;
import com.example.lianyu.repository.LikeRepository;
import com.example.lianyu.repository.MessageRepository;
import com.example.lianyu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    @Autowired
    public LikeService(LikeRepository likeRepository, UserRepository userRepository, 
                      MessageRepository messageRepository, ConversationRepository conversationRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    /**
     * 发送喜欢
     * @param likerUsername 发起喜欢的用户名
     * @param likedUsername 被喜欢的用户名
     * @return 喜欢关系对象，如果失败返回null
     */
    @Transactional
    public Like sendLike(String likerUsername, String likedUsername) {
        // 获取用户
        Optional<User> likerOpt = userRepository.findByUsername(likerUsername);
        Optional<User> likedOpt = userRepository.findByUsername(likedUsername);
        
        if (!likerOpt.isPresent() || !likedOpt.isPresent()) {
            return null;
        }
        
        User liker = likerOpt.get();
        User liked = likedOpt.get();
        
        // 检查是否已经喜欢过
        if (likeRepository.existsByLikerAndLiked(liker, liked)) {
            return null;
        }
        
        // 创建喜欢关系
        Like like = new Like(liker, liked);
        like = likeRepository.save(like);
        
        // 发送喜欢消息通知
        String content = liker.getUsername() + "对你表示了喜欢";
        Message message = new Message(liker, liked, "LIKE", content);
        messageRepository.save(message);
        
        // 检查是否互相喜欢
        if (likeRepository.existsByLikerAndLiked(liked, liker)) {
            // 创建约见对话
            createMeetConversation(liker, liked);
        }
        
        return like;
    }

    /**
     * 取消喜欢
     * @param likerUsername 发起喜欢的用户名
     * @param likedUsername 被喜欢的用户名
     * @return 是否成功取消
     */
    @Transactional
    public boolean cancelLike(String likerUsername, String likedUsername) {
        // 获取用户
        Optional<User> likerOpt = userRepository.findByUsername(likerUsername);
        Optional<User> likedOpt = userRepository.findByUsername(likedUsername);
        
        if (!likerOpt.isPresent() || !likedOpt.isPresent()) {
            return false;
        }
        
        User liker = likerOpt.get();
        User liked = likedOpt.get();
        
        // 检查是否存在喜欢关系
        Optional<Like> likeOpt = likeRepository.findByLikerAndLiked(liker, liked);
        if (!likeOpt.isPresent()) {
            return false;
        }
        
        // 删除喜欢关系
        likeRepository.deleteByLikerAndLiked(liker, liked);
        return true;
    }

    /**
     * 检查用户是否喜欢了另一个用户
     * @param likerUsername 发起喜欢的用户名
     * @param likedUsername 被喜欢的用户名
     * @return 是否存在喜欢关系
     */
    public boolean checkLike(String likerUsername, String likedUsername) {
        // 获取用户
        Optional<User> likerOpt = userRepository.findByUsername(likerUsername);
        Optional<User> likedOpt = userRepository.findByUsername(likedUsername);
        
        if (!likerOpt.isPresent() || !likedOpt.isPresent()) {
            return false;
        }
        
        User liker = likerOpt.get();
        User liked = likedOpt.get();
        
        return likeRepository.existsByLikerAndLiked(liker, liked);
    }

    /**
     * 检查两个用户是否互相喜欢
     * @param username1 用户名1
     * @param username2 用户名2
     * @return 是否互相喜欢
     */
    public boolean checkMutualLike(String username1, String username2) {
        return checkLike(username1, username2) && checkLike(username2, username1);
    }

    /**
     * 获取用户喜欢的所有用户
     * @param username 用户名
     * @return 被喜欢的用户列表
     */
    public List<Like> getLikedUsers(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        return likeRepository.findByLiker(user);
    }

    /**
     * 获取喜欢该用户的所有用户
     * @param username 用户名
     * @return 喜欢该用户的用户列表
     */
    public List<Like> getLikedByUsers(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        return likeRepository.findByLiked(user);
    }

    /**
     * 创建约见对话
     * @param user1 用户1
     * @param user2 用户2
     * @return 创建的对话
     */
    private Conversation createMeetConversation(User user1, User user2) {
        // 检查是否已存在对话
        Optional<Conversation> existingConversation = conversationRepository.findByUsers(user1, user2);
        if (existingConversation.isPresent()) {
            return existingConversation.get();
        }
        
        // 创建新的约见对话
        Conversation conversation = new Conversation(user1, user2, "MEET");
        conversation = conversationRepository.save(conversation);
        
        // 发送系统消息通知双方
        String content1 = "你和" + user2.getUsername() + "互相喜欢了对方，可以开始聊天了！";
        Message message1 = new Message(user2, user1, "SYSTEM", content1);
        messageRepository.save(message1);
        
        String content2 = "你和" + user1.getUsername() + "互相喜欢了对方，可以开始聊天了！";
        Message message2 = new Message(user1, user2, "SYSTEM", content2);
        messageRepository.save(message2);
        
        return conversation;
    }
}