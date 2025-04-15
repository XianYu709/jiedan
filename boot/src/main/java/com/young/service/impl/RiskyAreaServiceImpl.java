package com.young.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.RiskyAreaMapper;
import com.young.entity.RiskyArea;
import com.young.service.RiskyAreaService;
import org.springframework.stereotype.Service;

@Service
public class RiskyAreaServiceImpl extends ServiceImpl<RiskyAreaMapper, RiskyArea> implements RiskyAreaService {
    @Override
    public int add(RiskyArea riskyArea) {
        boolean emergency = selectOne("name", riskyArea);
        if (!emergency) {
            return baseMapper.insert(riskyArea);
        } else {
            throw new RuntimeException("该名称已存在");
        }
    }

    @Override
    public void put(RiskyArea riskyArea) {
        boolean emergency = selectOne("id", riskyArea);
        if (emergency) {
            baseMapper.updateById(riskyArea);
        } else {
            throw new RuntimeException("该条数据不存在");
        }
    }

    @Override
    public void delete(String id) {
        RiskyArea riskyArea = new RiskyArea();
        riskyArea.setId(id);
        boolean emergency = selectOne("id", riskyArea);
        if (emergency) {
            baseMapper.deleteById(id);
        } else {
            throw new RuntimeException("该条数据不存在");
        }
    }


    public boolean selectOne(String param, RiskyArea riskyArea) {
        QueryWrapper<RiskyArea> qw = new QueryWrapper<>();
        switch (param) {
            case "name":
                qw.eq(param, riskyArea.getName());
                break;
            case "id":
                qw.eq(param, riskyArea.getId());
                break;
            default:
                break;
        }
        RiskyArea emergency = baseMapper.selectOne(qw);
        return emergency != null;
    }
}
