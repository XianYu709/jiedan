package com.young.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.SysParamData;


public interface SysParamDataService extends IService<SysParamData> {

    Page<SysParamData> selectParamDatas(Page page);
}