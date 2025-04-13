package com.young.service.impl;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.SysParamDataMapper;
import com.young.entity.SysParamData;
import com.young.service.SysParamDataService;
import org.springframework.stereotype.Service;

@Service
public class SysParamDataServiceImpl extends ServiceImpl<SysParamDataMapper, SysParamData> implements SysParamDataService {

    @Override
    public Page<SysParamData> selectParamDatas(Page page) {
        return page.setRecords(baseMapper.selectParamDatas(page));
    }
}
