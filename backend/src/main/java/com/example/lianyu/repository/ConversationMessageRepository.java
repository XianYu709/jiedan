package com.example.lianyu.repository;

import com.example.lianyu.model.Conversation;
import com.example.lianyu.model.ConversationMessage;
import com.example.lianyu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationMessageRepository extends JpaRepository<ConversationMessage, Long> {
    
    /**
     * 查找对话中的所有消息
     * @param conversation 对话
     * @return 消息列表
     */
    List<ConversationMessage> findByConversationOrderByCreatedAtAsc(Conversation conversation);
    
    /**
     * 查找对话中的未读消息
     * @param conversation 对话
     * @param isRead 是否已读
     * @return 消息列表
     */
    List<ConversationMessage> findByConversationAndIsReadOrderByCreatedAtAsc(Conversation conversation, boolean isRead);
    
    /**
     * 查找用户在对话中发送的消息
     * @param conversation 对话
     * @param sender 发送者
     * @return 消息列表
     */
    List<ConversationMessage> findByConversationAndSenderOrderByCreatedAtAsc(Conversation conversation, User sender);
    
    /**
     * 统计对话中的未读消息数量
     * @param conversation 对话
     * @param isRead 是否已读
     * @return 未读消息数量
     */
    long countByConversationAndIsRead(Conversation conversation, boolean isRead);
    
    /**
     * 统计用户在对话中的未读消息数量
     * @param conversation 对话
     * @param sender 发送者
     * @param isRead 是否已读
     * @return 未读消息数量
     */
    long countByConversationAndSenderAndIsRead(Conversation conversation, User sender, boolean isRead);
}