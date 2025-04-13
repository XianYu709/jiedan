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


public class GeneratorCommon {
    private final static String dataBaseIp = "www.startyoung.shop";
    private final static String dataBasePort = "33060";
    private final static String dataBaseUname = "lcmline";
    private final static String dataBasePwd = "lcmline@123";
    private final static String[] tableNames = new String[]{"sys_org"};
    private final static String author = "Young";

    public static void main(String[] args) {
        AutoGenerator mpg = new AutoGenerator();


        GlobalConfig gc = new GlobalConfig();
        gc.setSwagger2(true);
        String projectPath = System.getProperty("user.dir");
        gc.setOutputDir(projectPath + "\\src\\main\\java\\com\\young\\generator");
        gc.setFileOverride(true);
        gc.setActiveRecord(true);
        gc.setEnableCache(false);
        gc.setBaseResultMap(true);
        gc.setBaseColumnList(true);
        gc.setOpen(true);
        /* 自定义文件命名，注意 %s 会自动填充表实体属性！ */
        gc.setAuthor(author);
        gc.setMapperName("%sMapper");
        gc.setXmlName("%sMapper");
        gc.setServiceName("%sService");
        gc.setServiceImplName("%sServiceImpl");
        gc.setControllerName("%sController");
        mpg.setGlobalConfig(gc);

        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setDbType(DbType.MYSQL);
        dsc.setTypeConvert(new MySqlTypeConvert() {

            @Override
            public IColumnType processTypeConvert(GlobalConfig gc, String fieldType) {
                System.out.println("转换类型：" + fieldType);


                String t = fieldType.toLowerCase();
                if (t.contains("date") || t.contains("time") || t.contains("year")) {
                    return DbColumnType.DATE;
                } else {
                    return super.processTypeConvert(gc, fieldType);
                }

            }
        });

        dsc.setDriverName("com.mysql.jdbc.Driver");
        dsc.setUrl("jdbc:mysql://" + dataBaseIp + ":" + dataBasePort + "/lcm-line?characterEncoding=UTF-8&useSSL=false");
        dsc.setUsername(dataBaseUname);
        dsc.setPassword(dataBasePwd);
        mpg.setDataSource(dsc);

        StrategyConfig strategy = new StrategyConfig();
        strategy.setRestControllerStyle(true);

        strategy.setNaming(NamingStrategy.underline_to_camel);
        strategy.setColumnNaming(NamingStrategy.underline_to_camel);
        strategy.setEntityLombokModel(true);
        strategy.setInclude(tableNames);

        mpg.setStrategy(strategy);

        PackageConfig pc = new PackageConfig();
        pc.setParent("com.young");
        pc.setController("controller");
        pc.setService("service");
        pc.setServiceImpl("service.impl");
        pc.setEntity("entity");
        pc.setMapper("dao");
        mpg.setPackageInfo(pc);

        InjectionConfig cfg = new InjectionConfig() {
            @Override
            public void initMap() {
                Map<String, Object> map = new HashMap<String, Object>();
                map.put("abc", this.getConfig().getGlobalConfig().getAuthor() + "-mp");
                this.setMap(map);
            }
        };

        List<FileOutConfig> focList = new ArrayList<>();
        focList.add(new FileOutConfig("/templates/mapper.xml.vm") {
            @Override
            public String outputFile(TableInfo tableInfo) {
                return "src/main/resources/mybatis/" + tableInfo.getEntityName() + "Mapper.xml";
            }
        });
        cfg.setFileOutConfigList(focList);
        mpg.setCfg(cfg);

        TemplateConfig tc = new TemplateConfig();
        tc.setXml(null);
        mpg.setTemplate(tc);

        mpg.execute();
    }
}

