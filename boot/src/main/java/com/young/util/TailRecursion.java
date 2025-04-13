package com.young.util;

import java.util.stream.Stream;


@FunctionalInterface
public interface TailRecursion<T> {


    TailRecursion<T> apply();


    default boolean isFinished() {
        return false;
    }


    default T getResult() {
        throw new Error("递归还没有结束,调用获得结果异常!");
    }


    default T invoke() {
        return Stream.iterate(this, TailRecursion::apply)
                .filter(TailRecursion::isFinished)
                .findFirst()
                .get()
                .getResult();
    }
}
