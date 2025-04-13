package com.young.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author Young
 * @date 2021/3/2 10:47
 * @des
 */
public class SnakeNameUtil {
    private static final Logger log = LoggerFactory.getLogger(SnakeNameUtil.class);


    /**
     * 功能描述:
     *
     * @param *     @param json
     * @param clazz
     * @return 将下划线转换为驼峰的形式，例如：user_name-->userName
     * @author Young
     * @date 2021/3/2
     */
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

    /**
     * 功能描述:
     * @author Young
     * @date 2021/3/2
     * @param  * @param str
     * @return 将对象的大写转换为下划线加小写，例如：userName-->user_name
     */
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
