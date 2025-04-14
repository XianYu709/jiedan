package com.young.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.DataEmergency;

public interface DataEmergencyService extends IService<DataEmergency> {
    int add(DataEmergency dataEmergency);

    void put(DataEmergency dataEmergency);

    void delete(String id);
}
