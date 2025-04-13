package com.young.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysUserMapper extends BaseMapper<SysUser> {

    Boolean updateAvatarByUname(@Param("uname" ) String uname, @Param("avatar" ) String avatar);

    List<SysUser> selectUserRoleDept(Page page, @Param("nick" ) String nick, @Param("deptId" ) String deptId);
}
