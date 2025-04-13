package com.young.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.entity.LayerManage;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LayerManageMapper extends BaseMapper<LayerManage> {
    List<LayerManage> selectLayerManage(Page page);
}
