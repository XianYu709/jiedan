package com.example.lianyu.repository;

import com.example.lianyu.model.Album;
import com.example.lianyu.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    
    /**
     * 根据用户查找相册
     * @param user 用户对象
     * @return 用户的相册列表
     */
    List<Album> findByUser(User user);
    
    /**
     * 根据用户查找相册（分页）
     * @param user 用户对象
     * @param pageable 分页参数
     * @return 分页后的用户相册列表
     */
    Page<Album> findByUser(User user, Pageable pageable);
    
    /**
     * 根据用户ID查找相册
     * @param userId 用户ID
     * @return 用户的相册列表
     */
    List<Album> findByUserId(Long userId);
    
    /**
     * 根据ID和用户查找相册
     * @param id 相册ID
     * @param user 用户对象
     * @return 相册对象
     */
    Optional<Album> findByIdAndUser(Long id, User user);
}