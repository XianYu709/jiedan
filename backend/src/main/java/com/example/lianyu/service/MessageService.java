package com.example.lianyu.service;

import com.example.lianyu.model.Conversation;
import com.example.lianyu.model.ConversationMessage;
import com.example.lianyu.model.Message;
import com.example.lianyu.model.User;
import com.example.lianyu.repository.ConversationMessageRepository;
import com.example.lianyu.repository.ConversationRepository;
import com.example.lianyu.repository.MessageRepository;
import com.example.lianyu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMessageRepository conversationMessageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, UserRepository userRepository,
                         ConversationRepository conversationRepository,
                         ConversationMessageRepository conversationMessageRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.conversationMessageRepository = conversationMessageRepository;
    }

    /**
     * 获取用户的所有消息
     * @param username 用户名
     * @return 消息列表
     */
    public List<Message> getUserMessages(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        return messageRepository.findByReceiverOrderByCreatedAtDesc(user);
    }

    /**
     * 获取用户的未读消息
     * @param username 用户名
     * @return 未读消息列表
     */
    public List<Message> getUnreadMessages(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        return messageRepository.findByReceiverAndIsReadOrderByCreatedAtDesc(user, false);
    }

    /**
     * 获取用户的特定类型消息
     * @param username 用户名
     * @param messageType 消息类型
     * @return 消息列表
     */
    public List<Message> getMessagesByType(String username, String messageType) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        return messageRepository.findByReceiverAndMessageTypeOrderByCreatedAtDesc(user, messageType);
    }

    /**
     * 标记消息为已读
     * @param messageId 消息ID
     * @param username 用户名（确保只有接收者可以标记为已读）
     * @return 是否成功标记
     */
    @Transactional
    public boolean markMessageAsRead(Long messageId, String username) {
        Optional<Message> messageOpt = messageRepository.findById(messageId);
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (!messageOpt.isPresent() || !userOpt.isPresent()) {
            return false;
        }
        
        Message message = messageOpt.get();
        User user = userOpt.get();
        
        // 确保只有接收者可以标记为已读
        if (!message.getReceiver().getId().equals(user.getId())) {
            return false;
        }
        
        message.setRead(true);
        messageRepository.save(message);
        return true;
    }

    /**
     * 发送消息
     * @param senderUsername 发送者用户名
     * @param receiverUsername 接收者用户名
     * @param messageType 消息类型
     * @param content 消息内容
     * @return 发送的消息
     */
    @Transactional
    public Message sendMessage(String senderUsername, String receiverUsername, String messageType, String content) {
        Optional<User> senderOpt = userRepository.findByUsername(senderUsername);
        Optional<User> receiverOpt = userRepository.findByUsername(receiverUsername);
        
        if (!senderOpt.isPresent() || !receiverOpt.isPresent()) {
            return null;
        }
        
        User sender = senderOpt.get();
        User receiver = receiverOpt.get();
        
        Message message = new Message(sender, receiver, messageType, content);
        return messageRepository.save(message);
    }

    /**
     * 获取用户的所有对话
     * @param username 用户名
     * @return 对话列表
     */
    public List<Conversation> getUserConversations(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        return conversationRepository.findByUserOrderByLastMessageAtDesc(user);
    }

    /**
     * 获取用户的约见对话
     * @param username 用户名
     * @return 约见对话列表
     */
    public List<Conversation> getMeetConversations(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        return conversationRepository.findByUserAndConversationTypeOrderByLastMessageAtDesc(user, "MEET");
    }

    /**
     * 获取对话中的所有消息
     * @param conversationId 对话ID
     * @param username 用户名（确保用户是对话参与者）
     * @return 消息列表
     */
    public List<ConversationMessage> getConversationMessages(Long conversationId, String username) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (!conversationOpt.isPresent() || !userOpt.isPresent()) {
            return null;
        }
        
        Conversation conversation = conversationOpt.get();
        User user = userOpt.get();
        
        // 确保用户是对话参与者
        if (!conversation.getUser1().getId().equals(user.getId()) && !conversation.getUser2().getId().equals(user.getId())) {
            return null;
        }
        
        return conversationMessageRepository.findByConversationOrderByCreatedAtAsc(conversation);
    }

    /**
     * 在对话中发送消息
     * @param conversationId 对话ID
     * @param senderUsername 发送者用户名
     * @param content 消息内容
     * @return 发送的消息
     */
    @Transactional
    public ConversationMessage sendConversationMessage(Long conversationId, String senderUsername, String content) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        Optional<User> senderOpt = userRepository.findByUsername(senderUsername);
        
        if (!conversationOpt.isPresent() || !senderOpt.isPresent()) {
            return null;
        }
        
        Conversation conversation = conversationOpt.get();
        User sender = senderOpt.get();
        
        // 确保发送者是对话参与者
        if (!conversation.getUser1().getId().equals(sender.getId()) && !conversation.getUser2().getId().equals(sender.getId())) {
            return null;
        }
        
        // 创建并保存消息
        ConversationMessage message = new ConversationMessage(conversation, sender, content);
        message = conversationMessageRepository.save(message);
        
        // 更新对话的最后消息时间
        conversation.setLastMessageAt(message.getCreatedAt());
        conversationRepository.save(conversation);
        
        return message;
    }

    /**
     * 标记对话中的所有消息为已读
     * @param conversationId 对话ID
     * @param username 用户名
     * @return 是否成功标记
     */
    @Transactional
    public boolean markConversationAsRead(Long conversationId, String username) {
        Optional<Conversation> conversationOpt = conversationRepository.findById(conversationId);
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (!conversationOpt.isPresent() || !userOpt.isPresent()) {
            return false;
        }
        
        Conversation conversation = conversationOpt.get();
        User user = userOpt.get();
        
        // 确保用户是对话参与者
        if (!conversation.getUser1().getId().equals(user.getId()) && !conversation.getUser2().getId().equals(user.getId())) {
            return false;
        }
        
        // 获取对话中的所有未读消息（不是由当前用户发送的）
        User otherUser = conversation.getUser1().getId().equals(user.getId()) ? conversation.getUser2() : conversation.getUser1();
        List<ConversationMessage> unreadMessages = conversationMessageRepository.findByConversationAndSenderOrderByCreatedAtAsc(conversation, otherUser);
        
        // 标记为已读
        for (ConversationMessage message : unreadMessages) {
            if (!message.isRead()) {
                message.setRead(true);
                conversationMessageRepository.save(message);
            }
        }
        
        return true;
    }

    /**
     * 获取用户未读消息数量
     * @param username 用户名
     * @return 未读消息数量
     */
    public long getUnreadMessageCount(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return 0;
        }
        
        User user = userOpt.get();
        return messageRepository.countByReceiverAndIsRead(user, false);
    }
}