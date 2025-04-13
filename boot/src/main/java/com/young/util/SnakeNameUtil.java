package com.young.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class SnakeNameUtil {
    private static final Logger log = LoggerFactory.getLogger(SnakeNameUtil.class);


    public static <T> T toSnakeObject(String json, Class<T> clazz) {
        ObjectMapper mapper = new ObjectMapper();
        T reqJson = null;
        mapper.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        try {
            reqJson = mapper.readValue(json, clazz);
        } catch (Exception e) {
            log.error("SnakeNameUtil:toSnakeObject", e.getMessage());
        }
        return reqJson;
    }

    private static Pattern humpPattern = Pattern.compile("[A-Z]");


    public static String SnakeToLine(String str) {
        Matcher matcher = humpPattern.matcher(str);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            matcher.appendReplacement(
                    sb, "_" + matcher.group(0).toLowerCase());
        }
        matcher.appendTail(sb);
        return sb.toString();
    }
}
