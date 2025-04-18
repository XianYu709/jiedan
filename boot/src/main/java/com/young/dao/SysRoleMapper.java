package com.young.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.young.entity.SysRole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysRoleMapper extends BaseMapper<SysRole> {

    List<SysRole> getRolesByUserId(@Param("userId") String userId);

    List<String> getRoleIdsByUserId(@Param("userId") String userId);

    Boolean checkRidsContainRval(@Param("rids")List<String> rids,@Param("rval")String rval);

    String checkUidContainRval(@Param("uid")String uid);

    List<SysRole> getRoles(SysRole sysRole);

}
