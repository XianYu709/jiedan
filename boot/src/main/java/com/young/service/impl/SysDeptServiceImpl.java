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

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author Young
 * @since 2023-09-05
 */
@Service
public class SysDeptServiceImpl extends ServiceImpl<SysDeptMapper, SysDept> implements SysDeptService {


    /**
     * 始树形结构创建
     * @param list
     * @return
     */
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
                //建立子树节点
                sysDept = this.buildChilTree(sysDept, leafNode);
                //为根节点设置子树节点
                sysDeptList.add(sysDept);
            }
            return sysDeptList;
        }
        return leafNode;

    }

    /**
     * 通过递归来创建子树形结构
     * @param sysDept
     * @param list
     * @return
     */
    @Override
    public SysDept buildChilTree(SysDept sysDept, List<SysDept> list) {
        List<SysDept> sysDeptList = new ArrayList<>();
        for (SysDept t : list) {
            //判断当前父节点是否存在子节点
            if (t.getDparent().equals(sysDept.getDid())) {
                sysDeptList.add(this.buildChilTree(t, list));
            }
        }
        sysDept.setChildren(sysDeptList);
        return sysDept;
    }

    @Override
    public Page<SysDept> selectDepts(Page page,  String dName) {
        return page.setRecords(baseMapper.selectDepts(page, dName));
    }
}
