package com.young.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.SysPermMapper;
import com.young.entity.SysPerm;
import com.young.service.SysPermService;
import com.young.util.AirUtils;
import com.young.vo.AuthVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SysPermServiceImpl extends ServiceImpl<SysPermMapper, SysPerm> implements SysPermService {
    @Autowired
    SysPermMapper sysPermMapper;

    @Override
    public Set<AuthVo> getPermsByUserId(String userId) {
        List<SysPerm> list = baseMapper.getPermsByUserId(userId);
        return list.stream().map(p -> new AuthVo(p.getPname(), p.getPval())).collect(Collectors.toSet());
    }

    @Override
    public List<SysPerm> getPermsByRoleId(String roleId) {
        return baseMapper.getPermsByRoleId(roleId);
    }

    @Override
    public void saveOrUpdate(List<SysPerm> perms) {
        if (perms != null && !perms.isEmpty()) {
            baseMapper.saveOrUpdate(perms);
        }
    }


    //始树形结构创建
    @Override
    public List<SysPerm> builTree(List<SysPerm> list) {
        List<SysPerm> sysPermList = new ArrayList<>();
        List<SysPerm> rootNode = new ArrayList<>();
        List<SysPerm> leafNode = new ArrayList<>();
        for (SysPerm sysPerm : list) {
            if (sysPerm.getLeaf() == false) {
                rootNode.add(sysPerm);
            }
            if (sysPerm.getLeaf() == true) {
                leafNode.add(sysPerm);
            }
        }
        if (AirUtils.hv(rootNode)) {
            for (SysPerm sysPerm : rootNode) {
                //建立子树节点
                sysPerm = this.buildChilTree(sysPerm, leafNode);
                //为根节点设置子树节点
                sysPermList.add(sysPerm);
            }
            return sysPermList;
        }
        return leafNode;

    }

    //通过递归来创建子树形结构
    @Override
    public SysPerm buildChilTree(SysPerm sysPerm, List<SysPerm> list) {
        List<SysPerm> sysPermList = new ArrayList<>();
        for (SysPerm t : list) {
            //判断当前父节点是否存在子节点
            if (t.getParent().equals(sysPerm.getPval())) {
                sysPermList.add(this.buildChilTree(t, list));
            }
        }
        sysPerm.setChildren(sysPermList);
        return sysPerm;
    }

}
