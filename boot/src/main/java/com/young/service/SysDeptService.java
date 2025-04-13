package com.young.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.SysDept;

import java.util.List;


public interface SysDeptService extends IService<SysDept> {


    List<SysDept> builTree(List<SysDept> list);

    SysDept buildChilTree(SysDept sysDept, List<SysDept> list);

    Page<SysDept> selectDepts(Page page, String dname);


}
