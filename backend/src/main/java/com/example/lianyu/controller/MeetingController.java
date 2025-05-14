package com.example.lianyu.controller;

import com.example.lianyu.model.MeetingArrangement;
import com.example.lianyu.model.TimeSlot;
import com.example.lianyu.service.MeetingArrangementService;
import com.example.lianyu.service.TimeSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin
public class MeetingController {

    private final TimeSlotService timeSlotService;
    private final MeetingArrangementService meetingArrangementService;

    @Autowired
    public MeetingController(TimeSlotService timeSlotService, MeetingArrangementService meetingArrangementService) {
        this.timeSlotService = timeSlotService;
        this.meetingArrangementService = meetingArrangementService;
    }

    /**
     * 提交用户在特定对话中的可用时间段
     * @param username 用户名
     * @param conversationId 对话ID
     * @param request 包含开始时间和结束时间的请求
     * @return 创建的时间段
     */
    @PostMapping("/conversations/{conversationId}/timeslots")
    public ResponseEntity<?> submitTimeSlot(
            @RequestHeader("Username") String username,
            @PathVariable("conversationId") Long conversationId,
            @RequestBody Map<String, String> request) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        String startTimeStr = request.get("startTime");
        String endTimeStr = request.get("endTime");
        
        if (startTimeStr == null || endTimeStr == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "开始时间和结束时间不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            Date startTime = new Date(Long.parseLong(startTimeStr));
            Date endTime = new Date(Long.parseLong(endTimeStr));
            
            TimeSlot timeSlot = timeSlotService.submitTimeSlot(username, conversationId, startTime, endTime);
            
            if (timeSlot == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "提交时间段失败");
                return ResponseEntity.badRequest().body(response);
            }
            
            return ResponseEntity.ok(timeSlot);
        } catch (NumberFormatException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "时间格式不正确");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 获取用户在特定对话中提交的所有时间段
     * @param username 用户名
     * @param conversationId 对话ID
     * @return 时间段列表
     */
    @GetMapping("/conversations/{conversationId}/timeslots")
    public ResponseEntity<?> getUserTimeSlots(
            @RequestHeader("Username") String username,
            @PathVariable("conversationId") Long conversationId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<TimeSlot> timeSlots = timeSlotService.getUserTimeSlots(username, conversationId);
        
        if (timeSlots == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "获取时间段失败");
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(timeSlots);
    }

    /**
     * 删除用户的时间段
     * @param username 用户名
     * @param timeSlotId 时间段ID
     * @return 操作结果
     */
    @DeleteMapping("/timeslots/{timeSlotId}")
    public ResponseEntity<?> deleteTimeSlot(
            @RequestHeader("Username") String username,
            @PathVariable("timeSlotId") Long timeSlotId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean success = timeSlotService.deleteTimeSlot(username, timeSlotId);
        
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "时间段已删除");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "删除时间段失败");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 删除用户在特定对话中的所有时间段
     * @param username 用户名
     * @param conversationId 对话ID
     * @return 操作结果
     */
    @DeleteMapping("/conversations/{conversationId}/timeslots/all")
    public ResponseEntity<?> deleteAllTimeSlots(
            @RequestHeader("Username") String username,
            @PathVariable("conversationId") Long conversationId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean success = timeSlotService.deleteAllTimeSlots(username, conversationId);
        
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "所有时间段已删除");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "删除所有时间段失败");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 查找两个用户在对话中的重叠时间段
     * @param username 用户名
     * @param conversationId 对话ID
     * @return 重叠的时间段列表
     */
    @GetMapping("/conversations/{conversationId}/overlapping-timeslots")
    public ResponseEntity<?> findOverlappingTimeSlots(
            @RequestHeader("Username") String username,
            @PathVariable("conversationId") Long conversationId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<TimeSlot> overlappingSlots = timeSlotService.findOverlappingTimeSlots(conversationId);
        
        if (overlappingSlots == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "获取重叠时间段失败");
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(overlappingSlots);
    }

    /**
     * 自动安排约见
     * @param username 用户名
     * @param conversationId 对话ID
     * @return 创建的约见安排
     */
    @PostMapping("/conversations/{conversationId}/auto-arrange")
    public ResponseEntity<?> autoArrangeMeeting(
            @RequestHeader("Username") String username,
            @PathVariable("conversationId") Long conversationId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        MeetingArrangement arrangement = meetingArrangementService.autoArrangeMeeting(conversationId);
        
        if (arrangement == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "没有找到重叠的时间段，无法安排约见");
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(arrangement);
    }

    /**
     * 获取对话的约见安排
     * @param username 用户名
     * @param conversationId 对话ID
     * @return 约见安排
     */
    @GetMapping("/conversations/{conversationId}/arrangement")
    public ResponseEntity<?> getMeetingArrangement(
            @RequestHeader("Username") String username,
            @PathVariable("conversationId") Long conversationId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        MeetingArrangement arrangement = meetingArrangementService.getMeetingArrangement(conversationId);
        
        if (arrangement == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "没有找到约见安排");
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(arrangement);
    }

    /**
     * 确认约见安排
     * @param username 用户名
     * @param arrangementId 约见安排ID
     * @return 操作结果
     */
    @PostMapping("/arrangements/{arrangementId}/confirm")
    public ResponseEntity<?> confirmMeetingArrangement(
            @RequestHeader("Username") String username,
            @PathVariable("arrangementId") Long arrangementId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean success = meetingArrangementService.confirmMeetingArrangement(arrangementId, username);
        
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "约见已确认");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "确认约见失败");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 取消约见安排
     * @param username 用户名
     * @param arrangementId 约见安排ID
     * @return 操作结果
     */
    @DeleteMapping("/arrangements/{arrangementId}")
    public ResponseEntity<?> cancelMeetingArrangement(
            @RequestHeader("Username") String username,
            @PathVariable("arrangementId") Long arrangementId) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean success = meetingArrangementService.cancelMeetingArrangement(arrangementId, username);
        
        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "约见已取消");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "取消约见失败");
            return ResponseEntity.badRequest().body(response);
        }
    }
}