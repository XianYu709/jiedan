package com.young.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.SysUserRoleMapper;
import com.young.entity.SysUserRole;
import com.young.service.SysUserRoleService;
import org.springframework.stereotype.Service;

@Service
public class SysUserRoleServiceImpl extends ServiceImpl<SysUserRoleMapper, SysUserRole> implements SysUserRoleService {
}
