package com.young.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.RiskyArea;

public interface RiskyAreaService extends IService<RiskyArea> {
    int add(RiskyArea riskyArea);

    void put(RiskyArea riskyArea);

    void delete(String id);
}
