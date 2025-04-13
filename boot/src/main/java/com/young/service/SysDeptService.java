package com.young.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.SysDept;

import java.util.List;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author Young
 * @since 2023-09-05
 */
public interface SysDeptService extends IService<SysDept> {


    List<SysDept> builTree(List<SysDept> list);

    SysDept buildChilTree(SysDept sysDept, List<SysDept> list);

    Page<SysDept> selectDepts(Page page, String dname);


}
