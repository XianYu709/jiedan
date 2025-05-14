package com.example.lianyu.service;

import com.example.lianyu.model.Album;
import com.example.lianyu.model.Photo;
import com.example.lianyu.model.User;
import com.example.lianyu.repository.AlbumRepository;
import com.example.lianyu.repository.PhotoRepository;
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

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;
    
    // 文件上传目录
    private final String uploadDir = "uploads/photos/album";
    private final String absoluteUploadDir;

    @Autowired
    public AlbumService(AlbumRepository albumRepository, PhotoRepository photoRepository, UserRepository userRepository) {
        this.albumRepository = albumRepository;
        this.photoRepository = photoRepository;
        this.userRepository = userRepository;
        
        // 获取项目根目录的绝对路径
        String rootPath = System.getProperty("user.dir");
        this.absoluteUploadDir = Paths.get(rootPath, uploadDir).toString();
        
        // 创建上传目录并确保有正确的写入权限
        File directory = new File(absoluteUploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                System.err.println("警告: 无法创建上传目录 " + absoluteUploadDir);
            } else {
                System.out.println("成功创建上传目录: " + absoluteUploadDir);
            }
        } else {
            System.out.println("上传目录已存在: " + absoluteUploadDir);
        }
        
        // 检查目录是否可写
        if (!directory.canWrite()) {
            System.err.println("警告: 上传目录不可写 " + absoluteUploadDir);
            // 尝试设置目录为可写
            boolean setWritable = directory.setWritable(true, false);
            if (setWritable) {
                System.out.println("成功设置上传目录为可写");
            } else {
                System.err.println("无法设置上传目录为可写，请检查权限");
            }
        }
    }

    /**
     * 获取用户的相册
     * @param username 用户名
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @return 用户的相册列表
     */
    public List<Album> getUserAlbums(String username, int page, int size) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return List.of();
        }
        
        User user = userOpt.get();
        
        // 使用分页查询
        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(page, size);
        
        List<Album> albums = albumRepository.findByUser(user, pageable).getContent();
        
        // 如果用户没有相册，创建一个默认相册
        if (albums.isEmpty() && page == 0) { // 只在第一页为空时创建默认相册
            Album defaultAlbum = new Album(user);
            albumRepository.save(defaultAlbum);
            albums = List.of(defaultAlbum);
        }
        
        return albums;
    }
    
    /**
     * 获取用户的相册（兼容旧版本，不分页）
     * @param username 用户名
     * @return 用户的相册列表
     */
    public List<Album> getUserAlbums(String username) {
        // 默认返回第一页，每页20条数据
        return getUserAlbums(username, 0, 20);
    }
    
    /**
     * 创建默认相册
     * @param username 用户名
     * @return 创建的相册
     */
    public Album createDefaultAlbum(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("用户不存在");
        }
        
        User user = userOpt.get();
        Album defaultAlbum = new Album(user);
        return albumRepository.save(defaultAlbum);
    }

    /**
     * 获取相册中的照片
     * @param albumId 相册ID
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @return 照片列表
     */
    public List<Photo> getAlbumPhotos(Long albumId, int page, int size) {
        Optional<Album> albumOpt = albumRepository.findById(albumId);
        if (!albumOpt.isPresent()) {
            return List.of();
        }
        
        Album album = albumOpt.get();
        
        // 使用分页查询
        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(page, size);
            
        return photoRepository.findByAlbumOrderByOrderIndexAsc(album, pageable).getContent();
    }
    
    /**
     * 获取相册中的照片（兼容旧版本，不分页）
     * @param albumId 相册ID
     * @return 照片列表
     */
    public List<Photo> getAlbumPhotos(Long albumId) {
        // 默认返回第一页，每页50条数据
        return getAlbumPhotos(albumId, 0, 50);
    }

    /**
     * 上传照片到相册
     * @param username 用户名
     * @param albumId 相册ID
     * @param photo 照片文件
     * @param description 照片描述
     * @return 上传后的照片对象
     */
    public Photo uploadPhoto(String username, Long albumId, MultipartFile photo, String description) throws IOException {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return null;
        }
        
        User user = userOpt.get();
        Optional<Album> albumOpt = albumRepository.findByIdAndUser(albumId, user);
        
        Album album;
        if (!albumOpt.isPresent()) {
            // 如果相册不存在，创建一个新相册
            album = new Album(user);
            albumRepository.save(album);
        } else {
            album = albumOpt.get();
        }
        
        // 保存照片文件
        String fileName = UUID.randomUUID().toString() + "_" + photo.getOriginalFilename();
        Path filePath = Paths.get(absoluteUploadDir, fileName);
        Files.write(filePath, photo.getBytes());
        
        // 创建照片记录 - 使用相对路径存储在数据库中
        Photo newPhoto = new Photo(album, "/" + uploadDir + "/" + fileName, description);
        
        // 设置照片顺序
        List<Photo> existingPhotos = photoRepository.findByAlbum(album);
        newPhoto.setOrderIndex(existingPhotos.size());
        
        return photoRepository.save(newPhoto);
    }

    /**
     * 删除照片
     * @param username 用户名
     * @param photoId 照片ID
     * @return 是否删除成功
     */
    public boolean deletePhoto(String username, Long photoId) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return false;
        }
        
        User user = userOpt.get();
        Optional<Photo> photoOpt = photoRepository.findById(photoId);
        
        if (!photoOpt.isPresent()) {
            return false;
        }
        
        Photo photo = photoOpt.get();
        Album album = photo.getAlbum();
        
        // 验证照片所属的相册是否属于当前用户
        if (!album.getUser().getId().equals(user.getId())) {
            return false;
        }
        
        // 删除照片文件
        try {
            String photoUrl = photo.getPhotoUrl();
            if (photoUrl != null && !photoUrl.isEmpty()) {
                // 去掉URL前面的斜杠
                String filePath = photoUrl.startsWith("/") ? photoUrl.substring(1) : photoUrl;
                Path path = Paths.get(filePath);
                Files.deleteIfExists(path);
            }
        } catch (IOException e) {
            // 记录错误但继续删除数据库记录
            System.err.println("删除照片文件失败: " + e.getMessage());
        }
        
        // 删除照片记录
        photoRepository.delete(photo);
        
        // 重新排序剩余照片
        List<Photo> remainingPhotos = photoRepository.findByAlbumOrderByOrderIndexAsc(album);
        for (int i = 0; i < remainingPhotos.size(); i++) {
            Photo p = remainingPhotos.get(i);
            p.setOrderIndex(i);
            photoRepository.save(p);
        }
        
        return true;
    }

    /**
     * 更新照片顺序
     * @param username 用户名
     * @param photoId 照片ID
     * @param newIndex 新的顺序索引
     * @return 是否更新成功
     */
    public boolean updatePhotoOrder(String username, Long photoId, Integer newIndex) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return false;
        }
        
        User user = userOpt.get();
        Optional<Photo> photoOpt = photoRepository.findById(photoId);
        
        if (!photoOpt.isPresent()) {
            return false;
        }
        
        Photo photo = photoOpt.get();
        Album album = photo.getAlbum();
        
        // 验证照片所属的相册是否属于当前用户
        if (!album.getUser().getId().equals(user.getId())) {
            return false;
        }
        
        // 获取所有照片并重新排序
        List<Photo> allPhotos = photoRepository.findByAlbumOrderByOrderIndexAsc(album);
        int oldIndex = photo.getOrderIndex();
        
        // 确保新索引在有效范围内
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= allPhotos.size()) {
            newIndex = allPhotos.size() - 1;
        }
        
        // 如果索引没有变化，直接返回
        if (oldIndex == newIndex) {
            return true;
        }
        
        // 更新照片顺序
        if (oldIndex < newIndex) {
            // 向后移动
            for (int i = oldIndex + 1; i <= newIndex; i++) {
                Photo p = allPhotos.get(i);
                p.setOrderIndex(i - 1);
                photoRepository.save(p);
            }
        } else {
            // 向前移动
            for (int i = newIndex; i < oldIndex; i++) {
                Photo p = allPhotos.get(i);
                p.setOrderIndex(i + 1);
                photoRepository.save(p);
            }
        }
        
        // 更新当前照片的索引
        photo.setOrderIndex(newIndex);
        photoRepository.save(photo);
        
        return true;
    }

    /**
     * 更新照片描述
     * @param username 用户名
     * @param photoId 照片ID
     * @param description 新的照片描述
     * @return 是否更新成功
     */
    public boolean updatePhotoDescription(String username, Long photoId, String description) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return false;
        }
        
        User user = userOpt.get();
        Optional<Photo> photoOpt = photoRepository.findById(photoId);
        
        if (!photoOpt.isPresent()) {
            return false;
        }
        
        Photo photo = photoOpt.get();
        Album album = photo.getAlbum();
        
        // 验证照片所属的相册是否属于当前用户
        if (!album.getUser().getId().equals(user.getId())) {
            return false;
        }
        
        // 更新照片描述
        photo.setDescription(description);
        photoRepository.save(photo);
        
        return true;
    }
}