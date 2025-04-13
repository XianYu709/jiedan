package com.young.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.SysParamType;

public interface SysParamTypeService extends IService<SysParamType> {

    Page<SysParamType> selectParamTypes(Page page);
}
