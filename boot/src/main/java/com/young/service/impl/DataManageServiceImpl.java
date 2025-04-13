package com.young.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.DataManageMapper;
import com.young.entity.DataManage;
import com.young.service.DataManageService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataManageServiceImpl extends ServiceImpl<DataManageMapper, DataManage> implements DataManageService {
    @Override
    public List<DataManage> selectDataManage() {
        return baseMapper.selectDataManages();
    }

    @Override
    public boolean deleteAll() {
        return baseMapper.deleteAll();
    }


}
