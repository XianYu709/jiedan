package com.young.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.LayerManageMapper;
import com.young.entity.LayerManage;
import com.young.service.LayerManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class LayerManageServiceImpl extends ServiceImpl<LayerManageMapper, LayerManage> implements LayerManageService {

    @Autowired
    LayerManageMapper layerManageMapper;

    @Override
    public Page<LayerManage> selectLayerManage(Page page) {
        return page.setRecords(baseMapper.selectLayerManage(page));
    }
}
