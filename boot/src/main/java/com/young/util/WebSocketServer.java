package com.young.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.ArrayList;


@ServerEndpoint(value = "/websocket/login")
@Component
public class WebSocketServer {
    private static final Logger log = LoggerFactory.getLogger(WebSocketServer.class);
    private static ArrayList<Session> sessions = new ArrayList<>();


    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        log.info("有新连接加入：{}，当前在线人数为：{}", session.getId(), sessions.size());
    }


    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        log.info("有一连接关闭：{}，当前在线人数为：{}", session.getId(), sessions.size());
    }


    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("服务端收到客户端[{}]的消息:{}", session.getId(), message);

    }

    @OnError
    public void onError(Session session, Throwable error) {
        log.error("发生错误");
        error.printStackTrace();
    }


    public static void sendMessage(String message) {
        try {
            for (Session s : sessions) {
                log.info("服务端给客户端[{}]发送消息{}", s.getId(), message);
                s.getBasicRemote().sendText(message);
            }
        } catch (Exception e) {
            log.error("服务端发送消息给客户端失败：{}", e);
        }
    }
}
