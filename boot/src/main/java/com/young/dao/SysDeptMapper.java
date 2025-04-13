package com.young.dao;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.entity.SysDept;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author Young
 * @since 2023-09-11
 */
@Mapper
public interface SysDeptMapper extends BaseMapper<SysDept> {

    List<SysDept> selectDepts(Page page, @Param("dname")String dname);
}
