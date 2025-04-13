package com.young.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.DataBookMapper;
import com.young.entity.DataBook;
import com.young.service.DataBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service
public class DataBookServiceImpl extends ServiceImpl<DataBookMapper, DataBook> implements DataBookService {

    @Override
    public List<DataBook> getDataBookList(DataBook dataBook) {
        return baseMapper.selectDataBook(dataBook);
    }

    
}
