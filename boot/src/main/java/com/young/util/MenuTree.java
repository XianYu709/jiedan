package com.young.util;

import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;


public class MenuTree {

    public List<MenuResource> cache;


    public List<MenuResource> menuList(List<MenuResource> menus) {
        List<MenuResource> list = new ArrayList<>();
        this.cache = menus;
        for (MenuResource m : menus) {

            if (StringUtils.isBlank(m.getParentId())) {
                MenuResource topMenu = new MenuResource(m);
                topMenu.setChildren(menuChild(m.getMenuId()));
                list.add(topMenu);
            }
        }
        return list;
    }


    private List<MenuResource> menuChild(String id) {
        List<MenuResource> lists = new ArrayList<>();
        for (MenuResource m : cache) {
            if (StringUtils.equals(id, m.getParentId())) {
                MenuResource childMenu = new MenuResource(m);
                childMenu.setChildren(menuChild(m.getMenuId()));
                lists.add(childMenu);
            }
        }
        return lists;

    }

}
