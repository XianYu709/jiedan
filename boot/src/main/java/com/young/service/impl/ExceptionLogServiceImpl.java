package com.young.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.young.dao.ExceptionLogMapper;
import com.young.entity.ExceptionLog;
import com.young.service.ExceptionLogService;
import org.springframework.stereotype.Service;

@Service
public class ExceptionLogServiceImpl extends ServiceImpl<ExceptionLogMapper, ExceptionLog> implements ExceptionLogService {
}
