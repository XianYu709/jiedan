package com.young.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.SysPerm;
import com.young.vo.AuthVo;

import java.util.List;
import java.util.Set;

public interface SysPermService extends IService<SysPerm> {

    Set<AuthVo> getPermsByUserId(String userId);

    List<SysPerm> getPermsByRoleId(String roleId);

    void saveOrUpdate(List<SysPerm> perms);

    List<SysPerm> builTree(List<SysPerm> list);

    SysPerm buildChilTree(SysPerm sysPerm, List<SysPerm> list);


}
