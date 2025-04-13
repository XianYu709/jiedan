package com.young.generator;


import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.converts.MySqlTypeConvert;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.config.rules.IColumnType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/***
 * 功能描述:代码生成器
 * @author Young
 * @date
 * @return void
 * @description
 */
public class GeneratorCommon {
    private final static String dataBaseIp = "www.startyoung.shop" ;
    private final static String dataBasePort = "33060" ;
    private final static String dataBaseUname = "lcmline" ;
    private final static String dataBasePwd = "lcmline@123" ;
    private final static String[] tableNames = new String[]{"sys_org"};
    private final static String author = "Young" ;

    public static void main(String[] args) {
        AutoGenerator mpg = new AutoGenerator();
        // 选择 freemarker 引擎，默认 Veloctiy
        //mpg.setTemplateEngine(new FreemarkerTemplateEngine());
        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setSwagger2(true); //实体属性 Swagger2 注解
        String projectPath = System.getProperty("user.dir" );
        gc.setOutputDir(projectPath + "\\src\\main\\java\\com\\young\\generator" );
        gc.setFileOverride(true);// 是否覆盖同名文件，默认是false
        gc.setActiveRecord(true);// 不需要ActiveRecord特性的请改为false
        gc.setEnableCache(false);// XML 二级缓存
        gc.setBaseResultMap(true);// XML ResultMap
        gc.setBaseColumnList(true);// XML columList
        gc.setOpen(true);//生成后打开文件夹
        /* 自定义文件命名，注意 %s 会自动填充表实体属性！ */
        gc.setAuthor(author);
        gc.setMapperName("%sMapper" );
        gc.setXmlName("%sMapper" );
        gc.setServiceName("%sService" );
        gc.setServiceImplName("%sServiceImpl" );
        gc.setControllerName("%sController" );
        mpg.setGlobalConfig(gc);
        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setDbType(DbType.MYSQL);
        dsc.setTypeConvert(new MySqlTypeConvert() {
            // 自定义数据库表字段类型转换【可选】
            @Override
            public IColumnType processTypeConvert(GlobalConfig gc, String fieldType) {
                System.out.println("转换类型：" + fieldType);
                // 注意！！processTypeConvert 存在默认类型转换，如果不是你要的效果请自定义返回、非如下直接返回。
                //默认会把日期类型 转为LocalDateTime ，在查询的时候会报错，这里改为Date
                String t = fieldType.toLowerCase();
                if (t.contains("date" ) || t.contains("time" ) || t.contains("year" )) {
                    return DbColumnType.DATE;
                } else {
                    return super.processTypeConvert(gc, fieldType);
                }

            }
        });
        //数据库连接配置
        dsc.setDriverName("com.mysql.jdbc.Driver" );
        dsc.setUrl("jdbc:mysql://" + dataBaseIp + ":" + dataBasePort + "/lcm-line?characterEncoding=UTF-8&useSSL=false" );
        dsc.setUsername(dataBaseUname);
        dsc.setPassword(dataBasePwd);
        mpg.setDataSource(dsc);
        // 策略配置
        StrategyConfig strategy = new StrategyConfig();
        strategy.setRestControllerStyle(true);//restful 风格
        //strategy.setCapitalMode(true);// 全局大写命名 ORACLE 注意
        strategy.setNaming(NamingStrategy.underline_to_camel);// 表名生成策略
        strategy.setColumnNaming(NamingStrategy.underline_to_camel);//采用驼峰映射
        strategy.setEntityLombokModel(true);//【实体】是否为lombok模型（默认 false）
        strategy.setInclude(tableNames);

        mpg.setStrategy(strategy);
        // 包名配置
        PackageConfig pc = new PackageConfig();
        pc.setParent("com.young" );
        pc.setController("controller" );
        pc.setService("service" );
        pc.setServiceImpl("service.impl" );
        pc.setEntity("entity" );
        pc.setMapper("dao" );
        mpg.setPackageInfo(pc);
        // 注入自定义配置，可以在 VM 中使用 cfg.abc 设置的值
        InjectionConfig cfg = new InjectionConfig() {
            @Override
            public void initMap() {
                Map<String, Object> map = new HashMap<String, Object>();
                map.put("abc", this.getConfig().getGlobalConfig().getAuthor() + "-mp" );
                this.setMap(map);
            }
        };
        //xml生成路径
        List<FileOutConfig> focList = new ArrayList<>();
        focList.add(new FileOutConfig("/templates/mapper.xml.vm" ) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                return "src/main/resources/mybatis/" + tableInfo.getEntityName() + "Mapper.xml" ;
            }
        });
        cfg.setFileOutConfigList(focList);
        mpg.setCfg(cfg);
        // 关闭默认 xml 生成，调整生成 至 根目录
        TemplateConfig tc = new TemplateConfig();
        tc.setXml(null);
        mpg.setTemplate(tc);

        mpg.execute();
    }
}

