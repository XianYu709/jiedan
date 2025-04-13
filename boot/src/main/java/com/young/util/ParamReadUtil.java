package com.young.util;

import com.young.entity.SysParamData;
import com.young.service.SysParamDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Young
 * @date 2020/3/9 11:03
 * @des 跟随系统自启动，调用Service 层的方法查询所有的param。存放在静态集合中供查询
 */
@Component
public class ParamReadUtil implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(ParamReadUtil.class);
    public static List<SysParamData> paramList;

    @Autowired
    private SysParamDataService sysParamService;

    @Override
    public void run(String... args) throws Exception {
        log.info("ParamReadUtil读取数据库字典！");
        paramList = sysParamService.list();
    }
}
