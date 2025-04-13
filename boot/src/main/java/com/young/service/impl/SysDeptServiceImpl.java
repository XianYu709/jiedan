package com.young.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.SysDeptMapper;
import com.young.entity.SysDept;
import com.young.entity.SysUser;
import com.young.service.SysDeptService;
import com.young.util.AirUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class SysDeptServiceImpl extends ServiceImpl<SysDeptMapper, SysDept> implements SysDeptService {


    @Override
    public List<SysDept> builTree(List<SysDept> list) {
        List<SysDept> sysDeptList = new ArrayList<>();
        List<SysDept> rootNode = new ArrayList<>();
        List<SysDept> leafNode = new ArrayList<>();
        for (SysDept sysDept : list) {
            if (sysDept.getDleaf() == 0) {
                rootNode.add(sysDept);
            }
            if (sysDept.getDleaf() == 1) {
                leafNode.add(sysDept);
            }
        }
        if (AirUtils.hv(rootNode)) {
            for (SysDept sysDept : rootNode) {

                sysDept = this.buildChilTree(sysDept, leafNode);

                sysDeptList.add(sysDept);
            }
            return sysDeptList;
        }
        return leafNode;

    }


    @Override
    public SysDept buildChilTree(SysDept sysDept, List<SysDept> list) {
        List<SysDept> sysDeptList = new ArrayList<>();
        for (SysDept t : list) {

            if (t.getDparent().equals(sysDept.getDid())) {
                sysDeptList.add(this.buildChilTree(t, list));
            }
        }
        sysDept.setChildren(sysDeptList);
        return sysDept;
    }

    @Override
    public Page<SysDept> selectDepts(Page page, String dName) {
        return page.setRecords(baseMapper.selectDepts(page, dName));
    }
}
