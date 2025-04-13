package com.young.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.young.entity.DataBook;
import com.young.vo.Json;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DataBookMapper extends BaseMapper<DataBook> {

    public List<DataBook> selectDataBook(DataBook dataBook);


}
