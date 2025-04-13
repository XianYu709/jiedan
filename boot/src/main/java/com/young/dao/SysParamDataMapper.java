package com.young.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.entity.SysParamData;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysParamDataMapper extends BaseMapper<SysParamData> {

    List<SysParamData> selectParamDatas(Page page);
}
