package com.young.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.entity.DataManage;
import com.young.entity.SysDept;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DataManageMapper extends BaseMapper<DataManage> {

    List<DataManage> selectDataManages();

    boolean deleteAll();
}
