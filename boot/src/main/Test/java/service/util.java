package service;

import com.young.service.SysUserService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;


public class util {


    @Autowired
    public SysUserService sysUserService;

    @Test
    public void test() {

        String orgname = sysUserService.getOrgByUname("admin");

    }
}
