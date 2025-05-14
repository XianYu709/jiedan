package com.example.lianyu.controller;

import com.example.lianyu.model.Conversation;
import com.example.lianyu.model.ConversationMessage;
import com.example.lianyu.model.Message;
import com.example.lianyu.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * 获取用户的所有消息
     * @param username 用户名
     * @return 消息列表
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllMessages(@RequestHeader("Username") String username) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<Message> messages = messageService.getUserMessages(username);
        return ResponseEntity.ok(messages);
    }

    /**
     * 获取用户的未读消息
     * @param username 用户名
     * @return 未读消息列表
     */
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadMessages(@RequestHeader("Username") String username) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<Message> messages = messageService.getUnreadMessages(username);
        return ResponseEntity.ok(messages);
    }

    /**
     * 获取用户的特定类型消息
     * @param username 用户名
     * @param type 消息类型
     * @return 消息列表
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<?> getMessagesByType(
            @RequestHeader("Username") String username,
            @PathVariable("type") String type) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<Message> messages = messageService.getMessagesByType(username, type);
        return ResponseEntity.ok(messages);
    }

    /**
     * 标记消息为已读
     * @param username 用户名
     * @param messageId 消息ID
     * @return 操作结果
     */
    @PostMapping("/read/{messageId}")
    public ResponseEntity<?> markMessageAsRead(
            @RequestHeader("Username") String username,
            @PathVariable("messageId") Long messageId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean success = messageService.markMessageAsRead(messageId, username);
        
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "消息已标记为已读");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "标记消息失败");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 获取用户的所有对话
     * @param username 用户名
     * @return 对话列表
     */
    @GetMapping("/conversations")
    public ResponseEntity<?> getUserConversations(@RequestHeader("Username") String username) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<Conversation> conversations = messageService.getUserConversations(username);
        return ResponseEntity.ok(conversations);
    }

    /**
     * 获取用户的约见对话
     * @param username 用户名
     * @return 约见对话列表
     */
    @GetMapping("/conversations/meet")
    public ResponseEntity<?> getMeetConversations(@RequestHeader("Username") String username) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<Conversation> conversations = messageService.getMeetConversations(username);
        return ResponseEntity.ok(conversations);
    }

    /**
     * 获取对话中的所有消息
     * @param username 用户名
     * @param conversationId 对话ID
     * @return 消息列表
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<?> getConversationMessages(
            @RequestHeader("Username") String username,
            @PathVariable("conversationId") Long conversationId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<ConversationMessage> messages = messageService.getConversationMessages(conversationId, username);
        
        if (messages == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "获取对话消息失败");
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(messages);
    }

    /**
     * 在对话中发送消息
     * @param username 用户名
     * @param conversationId 对话ID
     * @param request 包含消息内容的请求
     * @return 发送的消息
     */
    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<?> sendConversationMessage(
            @RequestHeader("Username") String username,
            @PathVariable("conversationId") Long conversationId,
            @RequestBody Map<String, String> request) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        String content = request.get("content");
        if (content == null || content.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "消息内容不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        ConversationMessage message = messageService.sendConversationMessage(conversationId, username, content);
        
        if (message == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "发送消息失败");
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(message);
    }

    /**
     * 标记对话中的所有消息为已读
     * @param username 用户名
     * @param conversationId 对话ID
     * @return 操作结果
     */
    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<?> markConversationAsRead(
            @RequestHeader("Username") String username,
            @PathVariable("conversationId") Long conversationId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean success = messageService.markConversationAsRead(conversationId, username);
        
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "对话消息已标记为已读");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "标记对话消息失败");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 获取用户未读消息数量
     * @param username 用户名
     * @return 未读消息数量
     */
    @GetMapping("/unread/count")
    public ResponseEntity<?> getUnreadMessageCount(@RequestHeader("Username") String username) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        long count = messageService.getUnreadMessageCount(username);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}