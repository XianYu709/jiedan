package com.example.lianyu.repository;

import com.example.lianyu.model.Album;
import com.example.lianyu.model.Photo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    
    /**
     * 根据相册查找照片
     * @param album 相册对象
     * @return 相册中的照片列表
     */
    List<Photo> findByAlbum(Album album);
    
    /**
     * 根据相册ID查找照片
     * @param albumId 相册ID
     * @return 相册中的照片列表
     */
    List<Photo> findByAlbumId(Long albumId);
    
    /**
     * 根据相册查找照片并按顺序排序
     * @param album 相册对象
     * @return 排序后的照片列表
     */
    List<Photo> findByAlbumOrderByOrderIndexAsc(Album album);
    
    /**
     * 根据相册查找照片并按顺序排序（分页）
     * @param album 相册对象
     * @param pageable 分页参数
     * @return 分页后的照片列表
     */
    Page<Photo> findByAlbumOrderByOrderIndexAsc(Album album, Pageable pageable);
    
    /**
     * 根据ID和相册查找照片
     * @param id 照片ID
     * @param album 相册对象
     * @return 照片对象
     */
    Optional<Photo> findByIdAndAlbum(Long id, Album album);
}