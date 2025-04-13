package com.young.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.young.entity.DataBook;

import java.util.List;

public interface DataBookService extends IService<DataBook> {

    public List<DataBook> getDataBookList(DataBook dataBook);

}
