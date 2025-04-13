package com.young.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.SysParamTypeMapper;
import com.young.entity.SysParamType;
import com.young.service.SysParamTypeService;
import org.springframework.stereotype.Service;

@Service
public class SysParamTypeServiceImpl extends ServiceImpl<SysParamTypeMapper, SysParamType> implements SysParamTypeService {

    @Override
    public Page<SysParamType> selectParamTypes(Page page) {
        return page.setRecords(baseMapper.selectParamTypes(page));
    }
}
