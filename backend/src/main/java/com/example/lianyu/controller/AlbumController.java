package com.example.lianyu.controller;

import com.example.lianyu.model.Album;
import com.example.lianyu.model.Photo;
import com.example.lianyu.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/albums")
@CrossOrigin
public class AlbumController {

    private final AlbumService albumService;

    @Autowired
    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    /**
     * 获取用户的相册
     * @param username 用户名
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @return 用户的相册列表
     */
    @GetMapping("/user")
    public ResponseEntity<?> getUserAlbums(
            @RequestHeader("Username") String username,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            List<Album> albums = albumService.getUserAlbums(username, page, size);
            return ResponseEntity.ok(albums);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "获取相册信息失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * 创建默认相册
     * @param username 用户名
     * @return 创建的相册
     */
    @PostMapping("/create")
    public ResponseEntity<?> createAlbum(@RequestHeader("Username") String username) {
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            Album album = albumService.createDefaultAlbum(username);
            return ResponseEntity.ok(album);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "创建相册失败: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * 获取相册中的照片
     * @param albumId 相册ID
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @return 照片列表
     */
    @GetMapping("/{albumId}/photos")
    public ResponseEntity<?> getAlbumPhotos(
            @PathVariable Long albumId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "50") int size) {
        List<Photo> photos = albumService.getAlbumPhotos(albumId, page, size);
        return ResponseEntity.ok(photos);
    }

    /**
     * 上传照片到相册
     * @param username 用户名
     * @param albumId 相册ID
     * @param photo 照片文件
     * @param description 照片描述
     * @return 上传结果
     */
    @PostMapping("/{albumId}/photos/upload")
    public ResponseEntity<?> uploadPhoto(
            @RequestHeader("Username") String username,
            @PathVariable Long albumId,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam(value = "description", required = false) String description) {
        
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (photo == null || photo.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "请选择要上传的照片");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            Photo uploadedPhoto = albumService.uploadPhoto(username, albumId, photo, description);
            
            if (uploadedPhoto == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "上传照片失败，请稍后再试");
                return ResponseEntity.badRequest().body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "照片上传成功");
            response.put("photo", uploadedPhoto);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "上传照片失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 删除照片
     * @param username 用户名
     * @param photoId 照片ID
     * @return 删除结果
     */
    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<?> deletePhoto(
            @RequestHeader("Username") String username,
            @PathVariable Long photoId) {
        
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean deleted = albumService.deletePhoto(username, photoId);
        
        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "照片删除成功");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "删除照片失败，请稍后再试");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 更新照片顺序
     * @param username 用户名
     * @param photoId 照片ID
     * @param newIndex 新的顺序索引
     * @return 更新结果
     */
    @PutMapping("/photos/{photoId}/order")
    public ResponseEntity<?> updatePhotoOrder(
            @RequestHeader("Username") String username,
            @PathVariable Long photoId,
            @RequestParam("newIndex") Integer newIndex) {
        
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean updated = albumService.updatePhotoOrder(username, photoId, newIndex);
        
        if (updated) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "照片顺序更新成功");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "更新照片顺序失败，请稍后再试");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 更新照片描述
     * @param username 用户名
     * @param photoId 照片ID
     * @param description 新的照片描述
     * @return 更新结果
     */
    @PutMapping("/photos/{photoId}/description")
    public ResponseEntity<?> updatePhotoDescription(
            @RequestHeader("Username") String username,
            @PathVariable Long photoId,
            @RequestParam("description") String description) {
        
        if (username == null || username.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "用户名不能为空");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean updated = albumService.updatePhotoDescription(username, photoId, description);
        
        if (updated) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "照片描述更新成功");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "更新照片描述失败，请稍后再试");
            return ResponseEntity.badRequest().body(response);
        }
    }
}