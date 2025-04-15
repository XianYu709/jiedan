package com.young.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.DataEmergencyMapper;
import com.young.entity.DataEmergency;
import com.young.service.DataEmergencyService;
import org.springframework.stereotype.Service;

@Service
public class DataEmergencyServiceImpl extends ServiceImpl<DataEmergencyMapper, DataEmergency> implements DataEmergencyService {
    @Override
    public int add(DataEmergency dataEmergency) {
        boolean emergency = selectOne("name", dataEmergency);
        if (!emergency) {
            return baseMapper.insert(dataEmergency);
        } else {
            throw new RuntimeException("该名称已存在");
        }
    }

    @Override
    public void put(DataEmergency dataEmergency) {
        boolean emergency = selectOne("id", dataEmergency);
        if (emergency) {
            baseMapper.updateById(dataEmergency);
        } else {
            throw new RuntimeException("该条数据不存在");
        }
    }

    @Override
    public void delete(String id) {
        DataEmergency dataEmergency = new DataEmergency();
        dataEmergency.setId(id);
        boolean emergency = selectOne("id", dataEmergency);
        if (emergency) {
            baseMapper.deleteById(id);
        } else {
            throw new RuntimeException("该条数据不存在");
        }
    }


    public boolean selectOne(String param, DataEmergency dataEmergency) {
        QueryWrapper<DataEmergency> qw = new QueryWrapper<>();
        switch (param) {
            case "name":
                qw.eq(param, dataEmergency.getName());
                break;
            case "id":
                qw.eq(param, dataEmergency.getId());
                break;
            default:
                break;
        }
        DataEmergency emergency = baseMapper.selectOne(qw);
        return emergency != null;
    }
}
