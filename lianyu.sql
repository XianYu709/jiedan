/*
 Navicat Premium Dump SQL

 Source Server         : xue
 Source Server Type    : MySQL
 Source Server Version : 80035 (8.0.35)
 Source Host           : localhost:3306
 Source Schema         : lianyu

 Target Server Type    : MySQL
 Target Server Version : 80035 (8.0.35)
 File Encoding         : 65001

 Date: 14/05/2025 07:41:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for albums
-- ----------------------------
DROP TABLE IF EXISTS `albums`;
CREATE TABLE `albums`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKcfmaqhra991wm7iiddqlnw88n`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FKcfmaqhra991wm7iiddqlnw88n` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of albums
-- ----------------------------
INSERT INTO `albums` VALUES (1, '2025-04-30 00:17:04.140825', 6);
INSERT INTO `albums` VALUES (2, '2025-05-01 08:20:45.556197', 2);
INSERT INTO `albums` VALUES (3, '2025-05-01 23:11:52.678580', 3);
INSERT INTO `albums` VALUES (4, '2025-05-11 23:01:17.117614', 1);
INSERT INTO `albums` VALUES (5, '2025-05-12 01:19:11.434972', 1);
INSERT INTO `albums` VALUES (6, '2025-05-12 14:55:41.993548', 1);
INSERT INTO `albums` VALUES (7, '2025-05-12 23:29:04.282502', 1);
INSERT INTO `albums` VALUES (8, '2025-05-12 23:43:37.045353', 1);
INSERT INTO `albums` VALUES (9, '2025-05-13 00:06:28.025410', 1);
INSERT INTO `albums` VALUES (10, '2025-05-13 00:08:43.461835', 1);
INSERT INTO `albums` VALUES (11, '2025-05-13 00:27:36.155193', 1);
INSERT INTO `albums` VALUES (12, '2025-05-13 00:30:56.995343', 1);
INSERT INTO `albums` VALUES (13, '2025-05-13 00:31:31.015361', 1);
INSERT INTO `albums` VALUES (14, '2025-05-13 00:41:57.018246', 1);
INSERT INTO `albums` VALUES (15, '2025-05-13 00:41:57.111403', 1);
INSERT INTO `albums` VALUES (16, '2025-05-13 00:41:57.179990', 1);
INSERT INTO `albums` VALUES (17, '2025-05-13 00:48:55.014036', 1);
INSERT INTO `albums` VALUES (18, '2025-05-13 00:48:55.089598', 1);
INSERT INTO `albums` VALUES (19, '2025-05-13 00:48:55.165687', 1);
INSERT INTO `albums` VALUES (20, '2025-05-13 00:48:55.985013', 1);
INSERT INTO `albums` VALUES (21, '2025-05-13 01:14:07.453251', 1);
INSERT INTO `albums` VALUES (22, '2025-05-13 01:18:39.017790', 1);
INSERT INTO `albums` VALUES (23, '2025-05-13 01:19:10.354353', 1);
INSERT INTO `albums` VALUES (24, '2025-05-13 01:43:09.020175', 1);
INSERT INTO `albums` VALUES (25, '2025-05-13 01:43:30.034759', 1);
INSERT INTO `albums` VALUES (26, '2025-05-13 01:43:55.004790', 1);
INSERT INTO `albums` VALUES (27, '2025-05-13 03:26:46.037162', 1);
INSERT INTO `albums` VALUES (28, '2025-05-13 03:27:21.014231', 1);
INSERT INTO `albums` VALUES (29, '2025-05-13 03:27:56.008845', 1);
INSERT INTO `albums` VALUES (30, '2025-05-13 03:28:49.004841', 1);
INSERT INTO `albums` VALUES (31, '2025-05-13 03:29:20.003568', 1);
INSERT INTO `albums` VALUES (32, '2025-05-13 03:30:00.003162', 1);
INSERT INTO `albums` VALUES (33, '2025-05-13 03:57:12.884060', 1);
INSERT INTO `albums` VALUES (34, '2025-05-13 04:16:00.035125', 1);
INSERT INTO `albums` VALUES (35, '2025-05-13 06:51:07.988693', 1);
INSERT INTO `albums` VALUES (36, '2025-05-13 13:27:21.741064', 1);
INSERT INTO `albums` VALUES (37, '2025-05-13 14:40:48.556582', 1);
INSERT INTO `albums` VALUES (38, '2025-05-13 14:41:01.580523', 1);

-- ----------------------------
-- Table structure for conversation_messages
-- ----------------------------
DROP TABLE IF EXISTS `conversation_messages`;
CREATE TABLE `conversation_messages`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `conversation_id` bigint NULL DEFAULT NULL,
  `sender_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKcr8qqgnqnaqq2hw3gr4wtfe2a`(`conversation_id` ASC) USING BTREE,
  INDEX `FK57egbymdh9yllolr5i6hdwiwq`(`sender_id` ASC) USING BTREE,
  CONSTRAINT `FK57egbymdh9yllolr5i6hdwiwq` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKcr8qqgnqnaqq2hw3gr4wtfe2a` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of conversation_messages
-- ----------------------------
INSERT INTO `conversation_messages` VALUES (1, '你好', '2025-04-29 23:33:21.300000', b'0', 1, 6);
INSERT INTO `conversation_messages` VALUES (2, '你好', '2025-04-29 23:33:22.561000', b'0', 1, 6);
INSERT INTO `conversation_messages` VALUES (3, '你好', '2025-04-29 23:33:23.080000', b'0', 1, 6);
INSERT INTO `conversation_messages` VALUES (4, '你好', '2025-04-29 23:33:23.276000', b'0', 1, 6);
INSERT INTO `conversation_messages` VALUES (5, '你好', '2025-04-29 23:33:23.417000', b'0', 1, 6);
INSERT INTO `conversation_messages` VALUES (6, '你好', '2025-04-29 23:33:23.577000', b'0', 1, 6);
INSERT INTO `conversation_messages` VALUES (7, '你好', '2025-04-29 23:33:24.816000', b'0', 1, 6);
INSERT INTO `conversation_messages` VALUES (8, '你好', '2025-04-29 23:33:25.353000', b'0', 1, 6);
INSERT INTO `conversation_messages` VALUES (9, '你好', '2025-04-29 23:33:25.537000', b'0', 1, 6);
INSERT INTO `conversation_messages` VALUES (10, '你好', '2025-04-29 23:33:25.721000', b'0', 1, 6);

-- ----------------------------
-- Table structure for conversations
-- ----------------------------
DROP TABLE IF EXISTS `conversations`;
CREATE TABLE `conversations`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `conversation_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `last_message_at` datetime(6) NULL DEFAULT NULL,
  `user1_id` bigint NULL DEFAULT NULL,
  `user2_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK8wv0rmd8jb3cqcbyng15ubrmk`(`user1_id` ASC) USING BTREE,
  INDEX `FKe7w0k1xem21pp85wxh5moodnk`(`user2_id` ASC) USING BTREE,
  CONSTRAINT `FK8wv0rmd8jb3cqcbyng15ubrmk` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKe7w0k1xem21pp85wxh5moodnk` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of conversations
-- ----------------------------
INSERT INTO `conversations` VALUES (1, 'MEET', '2025-04-29 23:32:25.818000', '2025-04-29 23:33:25.721000', 6, 2);
INSERT INTO `conversations` VALUES (2, 'MEET', '2025-05-01 05:07:45.074000', '2025-05-01 05:07:45.074000', 6, 3);
INSERT INTO `conversations` VALUES (3, 'MEET', '2025-05-01 08:41:20.193000', '2025-05-01 08:41:20.193000', 1, 6);
INSERT INTO `conversations` VALUES (4, 'MEET', '2025-05-01 08:42:18.599000', '2025-05-01 08:42:18.599000', 1, 2);
INSERT INTO `conversations` VALUES (5, 'MEET', '2025-05-01 09:32:58.897000', '2025-05-01 09:32:58.897000', 1, 8);
INSERT INTO `conversations` VALUES (6, 'MEET', '2025-05-01 09:53:45.123000', '2025-05-01 09:53:45.123000', 2, 8);
INSERT INTO `conversations` VALUES (7, 'MEET', '2025-05-01 13:10:05.292000', '2025-05-01 13:10:05.292000', 3, 8);
INSERT INTO `conversations` VALUES (8, 'MEET', '2025-05-01 23:05:22.519000', '2025-05-01 23:05:22.519000', 3, 2);
INSERT INTO `conversations` VALUES (9, 'MEET', '2025-05-01 23:53:28.737000', '2025-05-01 23:53:28.737000', 4, 8);
INSERT INTO `conversations` VALUES (10, 'MEET', '2025-05-01 23:53:31.168000', '2025-05-01 23:53:31.168000', 4, 2);
INSERT INTO `conversations` VALUES (11, 'MEET', '2025-05-01 23:53:47.567000', '2025-05-01 23:53:47.567000', 4, 6);
INSERT INTO `conversations` VALUES (12, 'MEET', '2025-05-01 23:55:13.718000', '2025-05-01 23:55:13.718000', 4, 3);

-- ----------------------------
-- Table structure for likes
-- ----------------------------
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `liked_id` bigint NULL DEFAULT NULL,
  `liker_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UKak2dhlct7dnw5ne9ifot32ly0`(`liker_id` ASC, `liked_id` ASC) USING BTREE,
  INDEX `FKfel94uh5ru5gx4gbu01kdjsp6`(`liked_id` ASC) USING BTREE,
  CONSTRAINT `FKfel94uh5ru5gx4gbu01kdjsp6` FOREIGN KEY (`liked_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKmnsakmpre3vbc3bp9wb21bcby` FOREIGN KEY (`liker_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of likes
-- ----------------------------
INSERT INTO `likes` VALUES (1, '2025-04-29 22:21:07.883000', 1, 3);
INSERT INTO `likes` VALUES (2, '2025-04-29 22:21:09.511000', 4, 3);
INSERT INTO `likes` VALUES (3, '2025-04-29 22:21:11.356000', 5, 3);
INSERT INTO `likes` VALUES (4, '2025-04-29 22:21:12.820000', 6, 3);
INSERT INTO `likes` VALUES (5, '2025-04-29 22:21:14.532000', 7, 3);
INSERT INTO `likes` VALUES (6, '2025-04-29 23:31:32.893000', 1, 2);
INSERT INTO `likes` VALUES (7, '2025-04-29 23:31:34.413000', 3, 2);
INSERT INTO `likes` VALUES (8, '2025-04-29 23:31:35.803000', 4, 2);
INSERT INTO `likes` VALUES (9, '2025-04-29 23:31:37.091000', 5, 2);
INSERT INTO `likes` VALUES (10, '2025-04-29 23:31:38.494000', 6, 2);
INSERT INTO `likes` VALUES (11, '2025-04-29 23:32:25.804000', 2, 6);
INSERT INTO `likes` VALUES (12, '2025-05-01 05:07:42.912000', 1, 6);
INSERT INTO `likes` VALUES (13, '2025-05-01 05:07:45.056000', 3, 6);
INSERT INTO `likes` VALUES (14, '2025-05-01 05:07:46.890000', 4, 6);
INSERT INTO `likes` VALUES (15, '2025-05-01 05:07:48.758000', 5, 6);
INSERT INTO `likes` VALUES (16, '2025-05-01 05:07:50.489000', 7, 6);
INSERT INTO `likes` VALUES (17, '2025-05-01 08:41:20.184000', 6, 1);
INSERT INTO `likes` VALUES (18, '2025-05-01 08:42:18.595000', 2, 1);
INSERT INTO `likes` VALUES (19, '2025-05-01 09:32:02.439000', 1, 8);
INSERT INTO `likes` VALUES (20, '2025-05-01 09:32:03.806000', 3, 8);
INSERT INTO `likes` VALUES (21, '2025-05-01 09:32:05.500000', 4, 8);
INSERT INTO `likes` VALUES (22, '2025-05-01 09:32:07.986000', 5, 8);
INSERT INTO `likes` VALUES (23, '2025-05-01 09:32:10.144000', 6, 8);
INSERT INTO `likes` VALUES (24, '2025-05-01 09:32:12.461000', 7, 8);
INSERT INTO `likes` VALUES (25, '2025-05-01 09:32:14.710000', 2, 8);
INSERT INTO `likes` VALUES (26, '2025-05-01 09:32:58.884000', 8, 1);
INSERT INTO `likes` VALUES (27, '2025-05-01 09:53:45.109000', 8, 2);
INSERT INTO `likes` VALUES (28, '2025-05-01 13:10:05.261000', 8, 3);
INSERT INTO `likes` VALUES (29, '2025-05-01 23:05:22.476000', 2, 3);
INSERT INTO `likes` VALUES (30, '2025-05-01 23:53:28.708000', 8, 4);
INSERT INTO `likes` VALUES (31, '2025-05-01 23:53:31.163000', 2, 4);
INSERT INTO `likes` VALUES (32, '2025-05-01 23:53:47.563000', 6, 4);
INSERT INTO `likes` VALUES (33, '2025-05-01 23:55:13.711000', 3, 4);

-- ----------------------------
-- Table structure for meeting_arrangements
-- ----------------------------
DROP TABLE IF EXISTS `meeting_arrangements`;
CREATE TABLE `meeting_arrangements`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_confirmed` bit(1) NOT NULL,
  `meeting_time` datetime(6) NOT NULL,
  `conversation_id` bigint NULL DEFAULT NULL,
  `meeting_place_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK1uy76o9mg6bt51pgwdx7xuhgr`(`conversation_id` ASC) USING BTREE,
  INDEX `FKhxvhndv53jgc3qokkk7k2ikl1`(`meeting_place_id` ASC) USING BTREE,
  CONSTRAINT `FK1uy76o9mg6bt51pgwdx7xuhgr` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKhxvhndv53jgc3qokkk7k2ikl1` FOREIGN KEY (`meeting_place_id`) REFERENCES `meeting_places` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of meeting_arrangements
-- ----------------------------

-- ----------------------------
-- Table structure for meeting_places
-- ----------------------------
DROP TABLE IF EXISTS `meeting_places`;
CREATE TABLE `meeting_places`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of meeting_places
-- ----------------------------

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `receiver_id` bigint NULL DEFAULT NULL,
  `sender_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKt05r0b6n0iis8u7dfna4xdh73`(`receiver_id` ASC) USING BTREE,
  INDEX `FK4ui4nnwntodh6wjvck53dbk9m`(`sender_id` ASC) USING BTREE,
  CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKt05r0b6n0iis8u7dfna4xdh73` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of messages
-- ----------------------------
INSERT INTO `messages` VALUES (1, '17376505630163.com对你表示了喜欢', '2025-04-29 22:21:07.904000', b'1', 'LIKE', 1, 3);
INSERT INTO `messages` VALUES (2, '17376505630163.com对你表示了喜欢', '2025-04-29 22:21:09.513000', b'1', 'LIKE', 4, 3);
INSERT INTO `messages` VALUES (3, '17376505630163.com对你表示了喜欢', '2025-04-29 22:21:11.357000', b'0', 'LIKE', 5, 3);
INSERT INTO `messages` VALUES (4, '17376505630163.com对你表示了喜欢', '2025-04-29 22:21:12.822000', b'1', 'LIKE', 6, 3);
INSERT INTO `messages` VALUES (5, '17376505630163.com对你表示了喜欢', '2025-04-29 22:21:14.533000', b'0', 'LIKE', 7, 3);
INSERT INTO `messages` VALUES (6, '17376505630@163.com对你表示了喜欢', '2025-04-29 23:31:32.895000', b'1', 'LIKE', 1, 2);
INSERT INTO `messages` VALUES (7, '17376505630@163.com对你表示了喜欢', '2025-04-29 23:31:34.414000', b'0', 'LIKE', 3, 2);
INSERT INTO `messages` VALUES (8, '17376505630@163.com对你表示了喜欢', '2025-04-29 23:31:35.805000', b'1', 'LIKE', 4, 2);
INSERT INTO `messages` VALUES (9, '17376505630@163.com对你表示了喜欢', '2025-04-29 23:31:37.092000', b'0', 'LIKE', 5, 2);
INSERT INTO `messages` VALUES (10, '17376505630@163.com对你表示了喜欢', '2025-04-29 23:31:38.495000', b'1', 'LIKE', 6, 2);
INSERT INTO `messages` VALUES (11, '123@2925.com对你表示了喜欢', '2025-04-29 23:32:25.805000', b'1', 'LIKE', 2, 6);
INSERT INTO `messages` VALUES (12, '你和17376505630@163.com互相喜欢了对方，可以开始聊天了！', '2025-04-29 23:32:25.830000', b'1', 'SYSTEM', 6, 2);
INSERT INTO `messages` VALUES (13, '你和123@2925.com互相喜欢了对方，可以开始聊天了！', '2025-04-29 23:32:25.831000', b'0', 'SYSTEM', 2, 6);
INSERT INTO `messages` VALUES (14, '123@2925.com对你表示了喜欢', '2025-05-01 05:07:42.931000', b'1', 'LIKE', 1, 6);
INSERT INTO `messages` VALUES (15, '123@2925.com对你表示了喜欢', '2025-05-01 05:07:45.058000', b'0', 'LIKE', 3, 6);
INSERT INTO `messages` VALUES (16, '你和17376505630163.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 05:07:45.088000', b'1', 'SYSTEM', 6, 3);
INSERT INTO `messages` VALUES (17, '你和123@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 05:07:45.090000', b'0', 'SYSTEM', 3, 6);
INSERT INTO `messages` VALUES (18, '123@2925.com对你表示了喜欢', '2025-05-01 05:07:46.892000', b'1', 'LIKE', 4, 6);
INSERT INTO `messages` VALUES (19, '123@2925.com对你表示了喜欢', '2025-05-01 05:07:48.760000', b'0', 'LIKE', 5, 6);
INSERT INTO `messages` VALUES (20, '123@2925.com对你表示了喜欢', '2025-05-01 05:07:50.491000', b'0', 'LIKE', 7, 6);
INSERT INTO `messages` VALUES (21, '17376505630@2925.com对你表示了喜欢', '2025-05-01 08:41:20.188000', b'0', 'LIKE', 6, 1);
INSERT INTO `messages` VALUES (22, '你和123@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 08:41:20.196000', b'0', 'SYSTEM', 1, 6);
INSERT INTO `messages` VALUES (23, '你和17376505630@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 08:41:20.197000', b'0', 'SYSTEM', 6, 1);
INSERT INTO `messages` VALUES (24, '17376505630@2925.com对你表示了喜欢', '2025-05-01 08:42:18.596000', b'0', 'LIKE', 2, 1);
INSERT INTO `messages` VALUES (25, '你和17376505630@163.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 08:42:18.600000', b'0', 'SYSTEM', 1, 2);
INSERT INTO `messages` VALUES (26, '你和17376505630@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 08:42:18.601000', b'0', 'SYSTEM', 2, 1);
INSERT INTO `messages` VALUES (27, '128673218476对你表示了喜欢', '2025-05-01 09:32:02.441000', b'0', 'LIKE', 1, 8);
INSERT INTO `messages` VALUES (28, '128673218476对你表示了喜欢', '2025-05-01 09:32:03.807000', b'0', 'LIKE', 3, 8);
INSERT INTO `messages` VALUES (29, '128673218476对你表示了喜欢', '2025-05-01 09:32:05.501000', b'1', 'LIKE', 4, 8);
INSERT INTO `messages` VALUES (30, '128673218476对你表示了喜欢', '2025-05-01 09:32:07.988000', b'0', 'LIKE', 5, 8);
INSERT INTO `messages` VALUES (31, '128673218476对你表示了喜欢', '2025-05-01 09:32:10.145000', b'0', 'LIKE', 6, 8);
INSERT INTO `messages` VALUES (32, '128673218476对你表示了喜欢', '2025-05-01 09:32:12.463000', b'0', 'LIKE', 7, 8);
INSERT INTO `messages` VALUES (33, '128673218476对你表示了喜欢', '2025-05-01 09:32:14.712000', b'1', 'LIKE', 2, 8);
INSERT INTO `messages` VALUES (34, '17376505630@2925.com对你表示了喜欢', '2025-05-01 09:32:58.886000', b'0', 'LIKE', 8, 1);
INSERT INTO `messages` VALUES (35, '你和128673218476互相喜欢了对方，可以开始聊天了！', '2025-05-01 09:32:58.906000', b'0', 'SYSTEM', 1, 8);
INSERT INTO `messages` VALUES (36, '你和17376505630@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 09:32:58.907000', b'0', 'SYSTEM', 8, 1);
INSERT INTO `messages` VALUES (37, '17376505630@163.com对你表示了喜欢', '2025-05-01 09:53:45.111000', b'0', 'LIKE', 8, 2);
INSERT INTO `messages` VALUES (38, '你和128673218476互相喜欢了对方，可以开始聊天了！', '2025-05-01 09:53:45.125000', b'0', 'SYSTEM', 2, 8);
INSERT INTO `messages` VALUES (39, '你和17376505630@163.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 09:53:45.128000', b'0', 'SYSTEM', 8, 2);
INSERT INTO `messages` VALUES (40, '17376505630163.com对你表示了喜欢', '2025-05-01 13:10:05.281000', b'0', 'LIKE', 8, 3);
INSERT INTO `messages` VALUES (41, '你和128673218476互相喜欢了对方，可以开始聊天了！', '2025-05-01 13:10:05.301000', b'0', 'SYSTEM', 3, 8);
INSERT INTO `messages` VALUES (42, '你和17376505630163.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 13:10:05.304000', b'0', 'SYSTEM', 8, 3);
INSERT INTO `messages` VALUES (43, '17376505630163.com对你表示了喜欢', '2025-05-01 23:05:22.502000', b'0', 'LIKE', 2, 3);
INSERT INTO `messages` VALUES (44, '你和17376505630@163.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:05:22.528000', b'0', 'SYSTEM', 3, 2);
INSERT INTO `messages` VALUES (45, '你和17376505630163.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:05:22.530000', b'0', 'SYSTEM', 2, 3);
INSERT INTO `messages` VALUES (46, 'a17376505630@2925.com对你表示了喜欢', '2025-05-01 23:53:28.729000', b'0', 'LIKE', 8, 4);
INSERT INTO `messages` VALUES (47, '你和128673218476互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:53:28.740000', b'0', 'SYSTEM', 4, 8);
INSERT INTO `messages` VALUES (48, '你和a17376505630@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:53:28.742000', b'0', 'SYSTEM', 8, 4);
INSERT INTO `messages` VALUES (49, 'a17376505630@2925.com对你表示了喜欢', '2025-05-01 23:53:31.164000', b'0', 'LIKE', 2, 4);
INSERT INTO `messages` VALUES (50, '你和17376505630@163.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:53:31.169000', b'0', 'SYSTEM', 4, 2);
INSERT INTO `messages` VALUES (51, '你和a17376505630@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:53:31.170000', b'0', 'SYSTEM', 2, 4);
INSERT INTO `messages` VALUES (52, 'a17376505630@2925.com对你表示了喜欢', '2025-05-01 23:53:47.563000', b'0', 'LIKE', 6, 4);
INSERT INTO `messages` VALUES (53, '你和123@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:53:47.568000', b'0', 'SYSTEM', 4, 6);
INSERT INTO `messages` VALUES (54, '你和a17376505630@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:53:47.569000', b'0', 'SYSTEM', 6, 4);
INSERT INTO `messages` VALUES (55, 'a17376505630@2925.com对你表示了喜欢', '2025-05-01 23:55:13.713000', b'0', 'LIKE', 3, 4);
INSERT INTO `messages` VALUES (56, '你和17376505630163.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:55:13.720000', b'0', 'SYSTEM', 4, 3);
INSERT INTO `messages` VALUES (57, '你和a17376505630@2925.com互相喜欢了对方，可以开始聊天了！', '2025-05-01 23:55:13.721000', b'0', 'SYSTEM', 3, 4);

-- ----------------------------
-- Table structure for photos
-- ----------------------------
DROP TABLE IF EXISTS `photos`;
CREATE TABLE `photos`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `order_index` int NULL DEFAULT NULL,
  `photo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `album_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKoamp0ftyyl46e15v3inuu6ke5`(`album_id` ASC) USING BTREE,
  CONSTRAINT `FKoamp0ftyyl46e15v3inuu6ke5` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of photos
-- ----------------------------
INSERT INTO `photos` VALUES (1, '1', 0, '/uploads/photos/album/fb0f45b1-254c-49e6-ae91-d4f149a85e9d_9e478f426637b06025442822f777ae792dbd8e3c2933187bb9f773e0f5fe53d4.webp', '2025-04-30 00:17:35.149128', 1);
INSERT INTO `photos` VALUES (2, 'OK', 0, '/uploads/photos/album/1502e320-e413-4fbf-85a2-240d52433a01_Capture001.png', '2025-05-01 08:21:29.736587', 2);
INSERT INTO `photos` VALUES (3, '及', 0, '/uploads/photos/album/5a482123-8289-4801-9b87-5fcabbd6e722_QQ图片20240803133225.jpg', '2025-05-01 23:20:18.749369', 3);
INSERT INTO `photos` VALUES (4, '是', 0, '/uploads/photos/album/5ed657e2-941b-48ea-8385-f2d9c6468875_微信图片_20231117125836.png', '2025-05-11 23:01:42.526896', 4);
INSERT INTO `photos` VALUES (5, '啊', 0, '/uploads/photos/album/05154836-f55f-4a4d-aa7b-10a40f3b4423_微信图片_20231125083457.jpg', '2025-05-12 01:19:21.064054', 5);
INSERT INTO `photos` VALUES (6, '就', 0, '/uploads/photos/album/0720889c-36aa-4543-a75b-a28057430c9d_微信图片_20231125083457.jpg', '2025-05-12 14:55:54.238611', 6);
INSERT INTO `photos` VALUES (7, NULL, 1, '/uploads/photos/album/8457abd8-bbca-4843-83b0-2eb09d43a559_微信图片_20231125083457.jpg', '2025-05-12 14:55:56.358084', 6);
INSERT INTO `photos` VALUES (8, NULL, 2, '/uploads/photos/album/700ee9bc-5e76-42e6-ac70-956c893f0db3_微信图片_20231125083457.jpg', '2025-05-12 14:56:00.460953', 6);
INSERT INTO `photos` VALUES (9, '撒大', 0, '/uploads/photos/album/9183fed8-1d5e-49d2-9929-c7cd230a66fe_微信图片_20231125083457.jpg', '2025-05-12 23:29:21.151553', 7);
INSERT INTO `photos` VALUES (10, NULL, 1, '/uploads/photos/album/fc2127ce-b054-468b-a688-afd74ea68c7f_微信图片_20231125083457.jpg', '2025-05-12 23:29:23.336040', 7);
INSERT INTO `photos` VALUES (11, NULL, 2, '/uploads/photos/album/234dbbf7-05f7-4c48-a097-2cf9aeff0cc7_微信图片_20231125083457.jpg', '2025-05-12 23:29:27.465087', 7);
INSERT INTO `photos` VALUES (12, NULL, 3, '/uploads/photos/album/70864584-73e7-4891-8d1c-985f6b0cd7d4_微信图片_20231125083457.jpg', '2025-05-12 23:29:35.633678', 7);
INSERT INTO `photos` VALUES (13, '撒大', 0, '/uploads/photos/album/d9792961-ac62-4162-9996-41d861ccb434_微信图片_20231125083457.jpg', '2025-05-13 00:27:42.422472', 11);
INSERT INTO `photos` VALUES (14, NULL, 1, '/uploads/photos/album/7a9145fa-0776-4dfc-8d74-01d3160a5417_微信图片_20231125083457.jpg', '2025-05-13 00:27:44.559934', 11);
INSERT INTO `photos` VALUES (15, NULL, 2, '/uploads/photos/album/d32ee47e-c05f-4d89-961a-7aef07092190_微信图片_20231125083457.jpg', '2025-05-13 00:27:48.676959', 11);
INSERT INTO `photos` VALUES (16, NULL, 3, '/uploads/photos/album/119b47c5-4bce-4f0d-be15-35e016d9a82c_微信图片_20231125083457.jpg', '2025-05-13 00:27:56.779308', 11);
INSERT INTO `photos` VALUES (17, '打算', 0, '/uploads/photos/album/2e7fe022-59cd-4fd8-bd5f-43899ca78677_微信图片_20231125083457.jpg', '2025-05-13 01:14:39.515497', 21);
INSERT INTO `photos` VALUES (18, NULL, 1, '/uploads/photos/album/9f8509e3-423e-4e95-ac49-db9747dd6866_微信图片_20231125083457.jpg', '2025-05-13 01:14:41.652140', 21);
INSERT INTO `photos` VALUES (19, NULL, 2, '/uploads/photos/album/7bf53abc-c037-4259-bf9a-0ab8457198a7_微信图片_20231125083457.jpg', '2025-05-13 01:14:45.773186', 21);
INSERT INTO `photos` VALUES (20, NULL, 3, '/uploads/photos/album/7fe7b238-532d-4970-ac74-2eec64721821_微信图片_20231125083457.jpg', '2025-05-13 01:14:53.884254', 21);
INSERT INTO `photos` VALUES (21, '蓄电池', 0, '/uploads/photos/album/434805b8-a914-49db-aa65-6b668b1b66cb_微信图片_20231125083457.jpg', '2025-05-13 03:57:19.221307', 33);
INSERT INTO `photos` VALUES (22, NULL, 1, '/uploads/photos/album/648a252b-19c6-416f-a54a-57e49ed6a6c5_微信图片_20231125083457.jpg', '2025-05-13 03:57:21.322051', 33);
INSERT INTO `photos` VALUES (23, NULL, 2, '/uploads/photos/album/d058ee51-fb01-4bba-a8fc-9d007b575c49_微信图片_20231125083457.jpg', '2025-05-13 03:57:25.437011', 33);
INSERT INTO `photos` VALUES (24, NULL, 3, '/uploads/photos/album/247dfa8c-88c8-490b-abb8-dcb20b6503c0_微信图片_20231125083457.jpg', '2025-05-13 03:57:33.553702', 33);

-- ----------------------------
-- Table structure for time_slots
-- ----------------------------
DROP TABLE IF EXISTS `time_slots`;
CREATE TABLE `time_slots`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `end_time` datetime(6) NOT NULL,
  `is_selected` bit(1) NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `conversation_id` bigint NULL DEFAULT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKcjiumwh8pgk3oss6gcqmom109`(`conversation_id` ASC) USING BTREE,
  INDEX `FK8b6dq5y3570le4l70587j9c7u`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FK8b6dq5y3570le4l70587j9c7u` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKcjiumwh8pgk3oss6gcqmom109` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of time_slots
-- ----------------------------
INSERT INTO `time_slots` VALUES (1, '2025-05-10 13:10:00.000000', b'0', '2025-05-02 13:10:00.000000', 7, 3);

-- ----------------------------
-- Table structure for user_profiles
-- ----------------------------
DROP TABLE IF EXISTS `user_profiles`;
CREATE TABLE `user_profiles`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `age` int NULL DEFAULT NULL,
  `education` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `height` int NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `photo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `weight` int NULL DEFAULT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  `introduction` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UK_e5h89rk3ijvdmaiig4srogdc6`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FKjcad5nfve11khsnpwj1mv8frj` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_profiles
-- ----------------------------
INSERT INTO `user_profiles` VALUES (1, 21, '本科', 190, '张三', '/uploads/photos/3128f545-4c83-4d4d-93f9-639c3f28903c_50c8ca774e8682a5168dbbb645c8b471_835898849913604425.png', 70, 1, NULL);
INSERT INTO `user_profiles` VALUES (2, 42, '博士', 160, '李四', '/uploads/photos/f8a87221-d7cd-468c-8fb4-47133ccd84c2_384e0fe44b4789af7a29439043a6704f_612174653284584593.png', 50, 3, NULL);
INSERT INTO `user_profiles` VALUES (3, 31, '高中', 171, '王五', '/uploads/photos/0a8ecf69-8814-4096-9f93-a342482cc036_81df447594698dfc8146c48e6a76cdba_8585725757006092796.png', 39, 4, NULL);
INSERT INTO `user_profiles` VALUES (4, 23, '专科', 165, '周六', '/uploads/photos/dfa116c5-dc50-458b-a5f9-5f3b1d1d72f0_ffdda067cb24bde71a685ea78b266649_4344425082124730042.png', 49, 5, NULL);
INSERT INTO `user_profiles` VALUES (5, 12, '高中', 156, '撒大', '/uploads/photos/0795a983-867b-4402-8f50-64e8700dac0b_c192fc80abd7e3153536c6d4e961e24c_3129457936370485472.png', 56, 6, NULL);
INSERT INTO `user_profiles` VALUES (6, 41, '博士', 167, '周发', '/uploads/photos/ad5b8afa-3ebf-4ec3-91d1-e0901f73b52f_abd80dd71c63cde422f6ba4a5a8d9345_3700176148483418649.png', 67, 7, NULL);
INSERT INTO `user_profiles` VALUES (7, 23, '高中', 178, '岑级', '/uploads/photos/53121ccc-5939-4d64-988b-8618ad2031c9_fd9edf8378c41e7ed7557ff5da0589c7_481209644689785404.png', 79, 2, NULL);
INSERT INTO `user_profiles` VALUES (8, 19, '高中', 123, '饭后', '/uploads/photos/ea646269-651a-44d6-acf5-0d397c366024_Capture001.png', 88, 8, NULL);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UK_r43af9ap4edm43mmtq01oddj6`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'sadqwedsadssdaqdsaqwewr', '17376505630@2925.com');
INSERT INTO `users` VALUES (2, '653643564375', '17376505630@163.com');
INSERT INTO `users` VALUES (3, 'sadqwedsadssdaqdsaqwewr', '17376505630163.com');
INSERT INTO `users` VALUES (4, 'sadqwedsadssdaqdsaqwewr', 'a17376505630@2925.com');
INSERT INTO `users` VALUES (5, 'sadqwedsadssdaqdsaqwewr', 'a1737505630@2925.com');
INSERT INTO `users` VALUES (6, '123456', '123@2925.com');
INSERT INTO `users` VALUES (7, '123456', '17376505622@2925.com');
INSERT INTO `users` VALUES (8, '12352153172', '128673218476');

SET FOREIGN_KEY_CHECKS = 1;
