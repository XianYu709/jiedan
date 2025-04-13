package com.young.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

    private static final String secret = "secret";


    public static String createToken(String username, Long time) throws UnsupportedEncodingException {
        long expiration = System.currentTimeMillis() + time;
        Date expireDate = new Date(expiration);
        String token = JWT.create()
                .withClaim("uname", username)
                .withExpiresAt(expireDate)
                .sign(Algorithm.HMAC256(secret));
        log.info("用户：{} =====> token：{}", username, token);
        return token;
    }


    public static boolean verify(String token, String username) throws UnsupportedEncodingException, TokenExpiredException {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        JWTVerifier verifier = JWT.require(algorithm)
                .withClaim("uname", username)
                .build();
        DecodedJWT jwt = verifier.verify(token);
        if (jwt.getExpiresAt().before(new Date())) {
            System.out.println("token过期");
            return false;
        }
        return true;
    }


    public static String getUsername(String token) {
        DecodedJWT decode = JWT.decode(token);
        return decode.getClaim("uname").asString();
    }
}

