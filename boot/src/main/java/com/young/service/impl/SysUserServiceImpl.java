package com.young.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.SysUserMapper;
import com.young.entity.SysUser;
import com.young.service.SysUserService;
import com.young.util.PageUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {

    @Override
    public Boolean updateAvatarByUname(String uname, String avatar) {
        return baseMapper.updateAvatarByUname(uname, avatar);
    }

    @Override
    public Page<SysUser> selectUserRoleDept(Page page, String nick, String did) {
        return page.setRecords(baseMapper.selectUserRoleDept(page, nick, did));
    }


}
