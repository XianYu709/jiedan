package com.young.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.LayerDeptMapper;
import com.young.entity.LayerDept;
import com.young.service.LayerDeptService;
import org.springframework.stereotype.Service;

@Service
public class LayerDeptServiceImpl extends ServiceImpl<LayerDeptMapper, LayerDept> implements LayerDeptService {
}
