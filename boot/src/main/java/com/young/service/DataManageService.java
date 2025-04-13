package com.young.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.DataManage;

import java.util.List;

public interface DataManageService extends IService<DataManage> {

    List<DataManage> selectDataManage();

    boolean deleteAll();
}
