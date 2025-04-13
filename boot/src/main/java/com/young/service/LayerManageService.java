package com.young.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.LayerManage;

import java.util.List;


public interface LayerManageService extends IService<LayerManage> {

    Page<LayerManage> selectLayerManage(Page page);
}
