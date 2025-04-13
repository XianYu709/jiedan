package com.young.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.SysUser;

public interface SysUserService extends IService<SysUser> {


    Boolean updateAvatarByUname(String uname, String avatar);

    Page<SysUser> selectUserRoleDept(Page page, String nick, String did);
}
