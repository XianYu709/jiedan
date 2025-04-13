package com.young.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.SysRolePermMapper;
import com.young.entity.SysRolePerm;
import com.young.service.SysRolePermService;
import org.springframework.stereotype.Service;

@Service
public class SysRolePermServiceImpl extends ServiceImpl<SysRolePermMapper, SysRolePerm> implements SysRolePermService {
}
