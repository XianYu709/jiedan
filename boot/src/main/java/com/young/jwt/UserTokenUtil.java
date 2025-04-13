package com.young.jwt;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class UserTokenUtil {

    public static String getToken(HttpServletRequest request, String tokenName) {
        String token = null;


        token = request.getHeader(tokenName);
        if (StringUtils.isNotBlank(token)) {
            return token;
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length != 0) {
            for (Cookie cookie : cookies) {
                if (cookie != null && tokenName.equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if (StringUtils.isNotBlank(token)) {
            return token;
        }

        token = request.getParameter(tokenName);
        return token;
    }

}
