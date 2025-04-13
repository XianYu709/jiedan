package com.young.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.young.entity.ExceptionLog;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ExceptionLogMapper extends BaseMapper<ExceptionLog> {
}
