package com.example.lianyu.repository;

import com.example.lianyu.model.Like;
import com.example.lianyu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    /**
     * 查找用户是否喜欢了另一个用户
     * @param liker 发起喜欢的用户
     * @param liked 被喜欢的用户
     * @return 喜欢关系
     */
    Optional<Like> findByLikerAndLiked(User liker, User liked);
    
    /**
     * 查找用户喜欢的所有用户
     * @param liker 发起喜欢的用户
     * @return 喜欢关系列表
     */
    List<Like> findByLiker(User liker);
    
    /**
     * 查找喜欢该用户的所有用户
     * @param liked 被喜欢的用户
     * @return 喜欢关系列表
     */
    List<Like> findByLiked(User liked);
    
    /**
     * 检查用户是否喜欢了另一个用户
     * @param liker 发起喜欢的用户
     * @param liked 被喜欢的用户
     * @return 是否存在喜欢关系
     */
    boolean existsByLikerAndLiked(User liker, User liked);
    
    /**
     * 删除用户对另一个用户的喜欢
     * @param liker 发起喜欢的用户
     * @param liked 被喜欢的用户
     */
    void deleteByLikerAndLiked(User liker, User liked);
}