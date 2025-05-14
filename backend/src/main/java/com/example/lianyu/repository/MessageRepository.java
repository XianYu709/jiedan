package com.example.lianyu.repository;

import com.example.lianyu.model.Message;
import com.example.lianyu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    /**
     * 查找用户收到的所有消息
     * @param receiver 接收消息的用户
     * @return 消息列表
     */
    List<Message> findByReceiverOrderByCreatedAtDesc(User receiver);
    
    /**
     * 查找用户收到的未读消息
     * @param receiver 接收消息的用户
     * @param isRead 是否已读
     * @return 消息列表
     */
    List<Message> findByReceiverAndIsReadOrderByCreatedAtDesc(User receiver, boolean isRead);
    
    /**
     * 查找用户收到的特定类型的消息
     * @param receiver 接收消息的用户
     * @param messageType 消息类型
     * @return 消息列表
     */
    List<Message> findByReceiverAndMessageTypeOrderByCreatedAtDesc(User receiver, String messageType);
    
    /**
     * 查找两个用户之间的所有消息
     * @param sender 发送消息的用户
     * @param receiver 接收消息的用户
     * @return 消息列表
     */
    List<Message> findBySenderAndReceiverOrderByCreatedAtDesc(User sender, User receiver);
    
    /**
     * 统计用户收到的未读消息数量
     * @param receiver 接收消息的用户
     * @param isRead 是否已读
     * @return 未读消息数量
     */
    long countByReceiverAndIsRead(User receiver, boolean isRead);
}