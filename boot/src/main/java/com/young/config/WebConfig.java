package com.young.config;

import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

import static com.alibaba.fastjson.serializer.SerializerFeature.*;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        FastJsonHttpMessageConverter converter = new FastJsonHttpMessageConverter();

        FastJsonConfig config = new FastJsonConfig();
        config.setSerializerFeatures(
                QuoteFieldNames,
                WriteMapNullValue,
                WriteNullNumberAsZero,
                WriteNullListAsEmpty,
                WriteNullStringAsEmpty,


                WriteDateUseDateFormat,
                DisableCircularReferenceDetect
        );
        converter.setFastJsonConfig(config);
        converters.add(converter);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedHeaders("*")
                .allowedMethods("*")
                .allowedOrigins("*")
                .allowCredentials(true)
                .maxAge(36000L).exposedHeaders("Cookie")
                .exposedHeaders("token")
                .exposedHeaders("Admin-Token")
                .exposedHeaders("Accept")
                .exposedHeaders("Access-Control-Request-Headers")
                .exposedHeaders("set-cookie")
        ;
    }


    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration conf = new CorsConfiguration();
        conf.addAllowedHeader("*");
        conf.addAllowedMethod("*");
        conf.addAllowedOrigin("*");
        conf.setAllowCredentials(true);
        conf.setMaxAge(36000L);
        conf.addExposedHeader("set-cookie");
        conf.addExposedHeader("Cookie");
        conf.addExposedHeader("access-control-allow-headers");
        conf.addExposedHeader("access-control-allow-methods");
        conf.addExposedHeader("access-control-allow-origin");
        conf.addExposedHeader("access-control-allow-credentials");
        conf.addExposedHeader("Access-Control-Request-Headers");
        conf.addExposedHeader("access-control-max-age");
        conf.addExposedHeader("X-Frame-Options");
        conf.addExposedHeader("token");
        conf.addExposedHeader("Admin-Token");
        conf.addExposedHeader("SecurityConfig");
        conf.addExposedHeader("Content-Type");
        conf.addExposedHeader("X-Requested-With");
        conf.addExposedHeader("Accept");
        conf.addExposedHeader("Origin");
        conf.addExposedHeader("Accept-Languag");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", conf);
        return new CorsFilter(source);
    }


}
