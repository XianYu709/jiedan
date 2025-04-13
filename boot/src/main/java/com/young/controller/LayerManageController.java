package com.young.controller;

import com.alibaba.excel.util.StringUtils;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.young.aop.SysLog;
import com.young.entity.LayerDept;
import com.young.entity.LayerManage;
import com.young.entity.SysDept;
import com.young.entity.SysUser;
import com.young.service.LayerDeptService;
import com.young.service.LayerManageService;
import com.young.util.AirUtils;
import com.young.util.PageUtils;
import com.young.vo.Json;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Api(tags = {"图层管理"})
@RestController
@RequestMapping("/layer_manage")
public class LayerManageController {

    private static final Logger log = LoggerFactory.getLogger(LayerManageController.class);

    @Autowired
    LayerManageService layerManageService;
    @Autowired
    LayerDeptService layerDeptService;

    @GetMapping("/list")
    public Json exclude(LayerManage layerManage) {
        String oper = "query layerManageList";
        log.info("{}", oper);

        try {
            if (StringUtils.isEmpty(layerManage.getDeptId())) {

                Page<LayerManage> page = layerManageService.selectLayerManage(PageUtils.getPageParam(layerManage.getPage(), layerManage.getPageSize()));
                return Json.succ(oper).data(page);
            } else {

                QueryWrapper<LayerDept> wrapper = new QueryWrapper<>();
                wrapper.eq("did", layerManage.getDeptId());
                List<LayerDept> depts = layerDeptService.list(wrapper);


                List<String> layerIds = depts.stream().map(LayerDept::getLayerId).collect(Collectors.toList());


                if (!layerIds.isEmpty()) {
                    QueryWrapper<LayerManage> manageWrapper = new QueryWrapper<>();
                    manageWrapper.in("id", layerIds);
                    List<LayerManage> manages = layerManageService.list(manageWrapper);
                    Map<String, List<LayerManage>> stringListMap = new HashMap<>();
                    stringListMap.put("records", manages);
                    return Json.succ(oper).data(stringListMap);
                } else {
                    return Json.succ(oper).data("No data found for given deptId");
                }
            }
        } catch (Exception e) {
            log.error("Error querying layerManageList", e);
            return Json.fail(oper + " - Error occurred: " + e.getMessage());
        }
    }


    @SysLog
    @ApiOperation(value = "添加图层信息")
    @PostMapping
    public Json add(@RequestBody String body) {
        String oper = "add layerManage info";
        LayerManage layerManage = JSON.parseObject(body, LayerManage.class);


        if (AirUtils.hv(layerManage.getDeptList())) {
            List<LayerDept> layerDeptList = new ArrayList<>();
            for (SysDept dept : layerManage.getDeptList()) {
                LayerDept layerDept = new LayerDept();
                layerDept.setDid(dept.getDid());
                layerDept.setLayerId(layerManage.getId());
                layerDeptList.add(layerDept);
            }
            layerDeptService.saveBatch(layerDeptList);
        }


        boolean save = layerManageService.save(layerManage);
        return Json.result(oper, save).data(layerManage);
    }

    @SysLog
    @ApiOperation(value = "修改图层信息")
    @PutMapping
    public Json update(@RequestBody LayerManage layerManage) {
        String oper = "update layerManage info";


        layerDeptService.remove(new QueryWrapper<LayerDept>().eq("layer_id", layerManage.getId()));
        if (AirUtils.hv(layerManage.getDeptList())) {

            List<LayerDept> layerDeptList = new ArrayList<>();
            for (SysDept dept : layerManage.getDeptList()) {
                LayerDept layerDept = new LayerDept();
                layerDept.setDid(dept.getDid());
                layerDept.setLayerId(layerManage.getId());
                layerDeptList.add(layerDept);
            }
            layerDeptService.saveBatch(layerDeptList);
        }

        boolean success = layerManageService.updateById(layerManage);
        return Json.result(oper, success).data(layerManage);
    }

    @SysLog
    @ApiOperation(value = "删除图层信息")
    @DeleteMapping
    public Json delete(@RequestBody List<String> ids) {
        String oper = "delete layerManage info";
        log.info("{},body:{}", oper);


        layerDeptService.remove(new QueryWrapper<LayerDept>().in("layer_id", ids));

        boolean success = layerManageService.remove(new QueryWrapper<LayerManage>().in("id", ids));
        return Json.result(oper, success);
    }
}
