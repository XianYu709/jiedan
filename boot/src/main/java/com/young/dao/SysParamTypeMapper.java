package com.young.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.entity.SysParamType;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysParamTypeMapper extends BaseMapper<SysParamType> {

    List<SysParamType> selectParamTypes(Page page);
}
