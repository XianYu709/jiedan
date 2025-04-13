/*
 Navicat Premium Data Transfer

 Source Server         : dawn
 Source Server Type    : PostgreSQL
 Source Server Version : 110016
 Source Host           : 192.168.65.120:54320
 Source Catalog        : twin-city
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 110016
 File Encoding         : 65001

 Date: 26/04/2024 15:12:45
*/


-- ----------------------------
-- Table structure for data_book
-- ----------------------------
DROP TABLE IF EXISTS "public"."data_book";
CREATE TABLE "public"."data_book" (
  "id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "book_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "book_type" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "book_date" date,
  "book_json_str" json
)
;
COMMENT ON COLUMN "public"."data_book"."id" IS 'id
';

-- ----------------------------
-- Records of data_book
-- ----------------------------
INSERT INTO "public"."data_book" VALUES ('1782288038282465282', '1358书签', 'viewShed', '2024-04-22', '{"pitch": 2.298923795505503, "height": 347.06698067382933, "distance": 170.65218542760687, "latitude": 44.69198339642978, "direction": 187.01491323711397, "longitude": 84.83002845112051, "verticalFov": 60, "horizontalFov": 90, "visibleAreaColor": "#2137e4", "invisibleAreaColor": "#ffdd00"}');
INSERT INTO "public"."data_book" VALUES ('1782288264858767361', '限速', 'sceneDrawn', '2024-04-22', '[{"hpr": {"roll": 0.017453292519943295, "pitch": 0.017453292519943295, "heading": 0.017453292519943295}, "color": {"red": 1, "blue": 1, "alpha": 1, "green": 1}, "scale": {"x": 5.8, "y": 5.8, "z": 5.8}, "uniId": 408578.9970668254, "modelUrl": "http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/RestrictionBoard.s3m", "position": {"x": 408578.9970668254, "y": 4516009.13755024, "z": 4485957.411839602}}]');
INSERT INTO "public"."data_book" VALUES ('1782957119759257601', '邮局', 'sceneDrawn', '2024-04-24', '[{"hpr": {"roll": 0.017453292519943295, "pitch": 0.017453292519943295, "heading": 0.017453292519943295}, "color": {"red": 1, "blue": 1, "alpha": 1, "green": 1}, "scale": {"x": 10, "y": 10, "z": 10}, "uniId": 409242.41963620175, "modelUrl": "http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/PO-Box.s3m", "position": {"x": 409242.41963620175, "y": 4512858.925658908, "z": 4489042.368737587}}]');
INSERT INTO "public"."data_book" VALUES ('1780054955151921154', '视廊big', 'viewShed', '2024-04-16', '{"pitch": -0.12333075857846607, "height": 335.6033212796786, "distance": 2005.841084765682, "latitude": 44.7117392775183, "direction": 49.476668919268576, "longitude": 84.83520650490082, "verticalFov": 19, "horizontalFov": 98, "visibleAreaColor": "#00ff00", "invisibleAreaColor": "#ff0000"}');
INSERT INTO "public"."data_book" VALUES ('1780416401337552897', '小品测试1', 'sceneDrawn', '2024-04-17', '[{"hpr": {"roll": 0, "pitch": 0, "heading": 0}, "color": {"red": 1, "blue": 1, "alpha": 1, "green": 1}, "scale": {"x": 1, "y": 1, "z": 1}, "uniId": 408591.6744283562, "modelUrl": "http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/T-TelBooth.s3m", "position": {"x": 408591.6744283562, "y": 4515931.395154014, "z": 4486054.858966031}}, {"hpr": {"roll": 0, "pitch": 0, "heading": 0}, "color": {"red": 1, "blue": 1, "alpha": 1, "green": 1}, "scale": {"x": 1, "y": 1, "z": 1}, "uniId": 408590.6723491033, "modelUrl": "http://support.supermap.com.cn:8090/webgl/Cesium/examples/webgl/data/s3mLibrary/RestrictionBoard.s3m", "position": {"x": 408590.6723491033, "y": 4515928.83862865, "z": 4486057.5241639875}}]');
INSERT INTO "public"."data_book" VALUES ('1780760863725129730', '阴影1', 'shade', '2024-04-18', '{"endTime": "12", "selDate": "2024-04-18", "startTime": "10", "bottomHeight": 21, "extrudeHeight": 21}');
INSERT INTO "public"."data_book" VALUES ('1780776946683154434', '坡度分析全部区域', 'slop', '2024-04-18', '{"style": "showAll", "trans": 0.4, "clipMode": "calModeall_any", "wideMaxR": 78, "wideMinR": 0, "colorTables": "3"}');
INSERT INTO "public"."data_book" VALUES ('1780789897267843073', 'box裁剪', 'boxCrop', '2024-04-18', '{"range": 0, "width": 5, "height": 5, "length": 55, "clipMode": "clip_behind_all_plane"}');
INSERT INTO "public"."data_book" VALUES ('1780830849575489538', 'Cross剪裁书签', 'crossCrop', '2024-04-18', '{"dim": {"x": 12, "y": 18, "z": 1}, "roll": 37, "pitch": 33, "width": 12, "height": 5, "length": 18, "heading": 14, "isMoving": false, "position": {"x": 408573.3248475982, "y": 4515927.419791709, "z": 4486060.483770194}, "startClip": false, "hasClipped": true, "extrudeDistance": 5.8}');
INSERT INTO "public"."data_book" VALUES ('1778690189670027265', '视廊1', 'viewShed', '2024-04-12', '{"pitch": 0.1149176849199656, "height": 340.815097336701, "distance": 149.2942777442242, "latitude": 44.691340428050765, "direction": 77.79260724227434, "longitude": 84.83223182104612, "verticalFov": 19, "horizontalFov": 26, "visibleAreaColor": "#00ff00", "invisibleAreaColor": "#ff0000"}');
INSERT INTO "public"."data_book" VALUES ('1778690321677357058', '视廊2', 'viewShed', '2024-04-12', '{"pitch": -4, "height": 340.30025955088723, "distance": 168, "latitude": 44.69322031638185, "direction": 61, "longitude": 84.8335603768306, "verticalFov": 19, "horizontalFov": 98, "visibleAreaColor": "#00ff00", "invisibleAreaColor": "#ff0000"}');
INSERT INTO "public"."data_book" VALUES ('1780045254850842625', '开敞度2', 'viewDemo', '2024-04-16', '{"height": 341.3254528610297, "EndAngle": 360, "calMode1": "2", "isClosed": false, "latitude": 44.68876756373552, "obServer": 135, "longitude": 84.83501443583398, "HiddenColor": "#0984e1", "VisibleColor": "#f00000", "StartingAngle": 20}');
INSERT INTO "public"."data_book" VALUES ('1780052636213514241', '开敞度', 'viewDemo', '2024-04-16', '{"height": 340.4030284228597, "EndAngle": 360, "calMode1": "2", "isClosed": false, "latitude": 44.69064236097432, "obServer": 100, "longitude": 84.82996313687364, "HiddenColor": "#E36C09", "VisibleColor": "#00B7EF", "StartingAngle": 0}');
INSERT INTO "public"."data_book" VALUES ('1780832566820016129', 'box裁剪999', 'boxCrop', '2024-04-18', '{"range": 0, "width": 5, "height": 5, "length": 5, "clipMode": "clip_behind_all_plane"}');
INSERT INTO "public"."data_book" VALUES ('1780833159953321985', '视廊123', 'viewShed', '2024-04-18', '{"pitch": -11.5081908157412, "height": 340.31173612130016, "distance": 117.27069592861416, "latitude": 44.69239331246953, "direction": 78.45531920995415, "longitude": 84.83095321529748, "verticalFov": 60, "horizontalFov": 90, "visibleAreaColor": "#00ff00", "invisibleAreaColor": "#ff0000"}');

-- ----------------------------
-- Table structure for data_manage
-- ----------------------------
DROP TABLE IF EXISTS "public"."data_manage";
CREATE TABLE "public"."data_manage" (
  "id" varchar(254) COLLATE "pg_catalog"."default" NOT NULL,
  "work_space" varchar(255) COLLATE "pg_catalog"."default",
  "data_source" varchar(255) COLLATE "pg_catalog"."default",
  "data_set" varchar(255) COLLATE "pg_catalog"."default",
  "url" varchar(255) COLLATE "pg_catalog"."default",
  "status" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of data_manage
-- ----------------------------
INSERT INTO "public"."data_manage" VALUES ('1783744264832872450', 'data-twin-city', 'data', '路网', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/路网', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872451', 'data-twin-city', 'data', '住宿服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/住宿服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872452', 'data-twin-city', 'MapYX', 'MapYX', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/MapYX/datasets/name/MapYX', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872453', 'data-twin-city', 'data', '建筑底面_1', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/建筑底面_1', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872454', 'data-twin-city', 'data', '通行设施', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/通行设施', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872455', 'data-twin-city', 'data', '政府机构及社会团体', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/政府机构及社会团体', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872456', 'data-twin-city', 'build', '房屋', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/build/datasets/name/房屋', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872457', 'data-twin-city', 'SHP', '道路', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/SHP/datasets/name/道路', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872458', 'data-twin-city', 'data', '餐饮服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/餐饮服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872459', 'data-twin-city', 'data', '路网_Node', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/路网_Node', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872460', 'data-twin-city', 'build', 'build', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/build/datasets/name/build', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872461', 'data-twin-city', 'SHP', '房屋', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/SHP/datasets/name/房屋', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872462', 'data-twin-city', 'data', '公司企业', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/公司企业', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872463', 'data-twin-city', 'TIF', 'DEM', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/TIF/datasets/name/DEM', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872464', 'data-twin-city', 'data', '金融保险服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/金融保险服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872465', 'data-twin-city', 'data', '汽车服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/汽车服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872466', 'data-twin-city', 'data', '交通设施服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/交通设施服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872467', 'data-twin-city', 'data', '汽车维修', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/汽车维修', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872468', 'data-twin-city', 'data', '科教文化服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/科教文化服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872469', 'data-twin-city', 'data', '摩托车服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/摩托车服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872470', 'data-twin-city', 'data', '生活服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/生活服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872471', 'data-twin-city', 'data', '体育休闲服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/体育休闲服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872472', 'data-twin-city', 'data', '商务住宅', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/商务住宅', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872473', 'data-twin-city', 'data', '医疗保健服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/医疗保健服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872474', 'data-twin-city', 'SHP', 'POI', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/SHP/datasets/name/POI', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872475', 'data-twin-city', 'data', '地名地址信息', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/地名地址信息', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872476', 'data-twin-city', 'SHP', '轨道交通', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/SHP/datasets/name/轨道交通', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872477', 'data-twin-city', 'TIF', 'DOM', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/TIF/datasets/name/DOM', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872478', 'data-twin-city', 'data', '建筑底面', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/建筑底面', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872479', 'data-twin-city', 'data', '购物服务', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/购物服务', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872480', 'data-twin-city', 'MapSL', 'MapSL', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/MapSL/datasets/name/MapSL', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872481', 'data-twin-city', 'SHP', '水系', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/SHP/datasets/name/水系', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872482', 'data-twin-city', 'data', '公共设施', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/公共设施', '1');
INSERT INTO "public"."data_manage" VALUES ('1783744264832872483', 'data-twin-city', 'data', 'tuixian_Line', 'http://192.168.65.120:4090/iserver/services/data-twin-city/rest/data/datasources/name/data/datasets/name/tuixian_Line', '1');

-- ----------------------------
-- Table structure for layer_dept
-- ----------------------------
DROP TABLE IF EXISTS "public"."layer_dept";
CREATE TABLE "public"."layer_dept" (
  "did" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "layer_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of layer_dept
-- ----------------------------
INSERT INTO "public"."layer_dept" VALUES ('1701869174487355393', '');
INSERT INTO "public"."layer_dept" VALUES ('1701869121278414850', '');
INSERT INTO "public"."layer_dept" VALUES ('1701869174487355393', '1783371647437312002');
INSERT INTO "public"."layer_dept" VALUES ('1701869174487355393', '1777866398412853249');
INSERT INTO "public"."layer_dept" VALUES ('1701869174487355393', '1783698150507212802');
INSERT INTO "public"."layer_dept" VALUES ('1701869174487355393', '1783369582988300290');
INSERT INTO "public"."layer_dept" VALUES ('1701869174487355393', '1783744820003532802');

-- ----------------------------
-- Table structure for layer_manage
-- ----------------------------
DROP TABLE IF EXISTS "public"."layer_manage";
CREATE TABLE "public"."layer_manage" (
  "id" varchar(254) COLLATE "pg_catalog"."default" NOT NULL,
  "layer_name" varchar(255) COLLATE "pg_catalog"."default",
  "type" varchar(255) COLLATE "pg_catalog"."default",
  "url" varchar(255) COLLATE "pg_catalog"."default",
  "gis_data_url" varchar(255) COLLATE "pg_catalog"."default",
  "api_data_url" varchar(255) COLLATE "pg_catalog"."default",
  "gis_data_key" varchar(255) COLLATE "pg_catalog"."default",
  "fields_map" json
)
;

-- ----------------------------
-- Records of layer_manage
-- ----------------------------
INSERT INTO "public"."layer_manage" VALUES ('1783371647437312002', '地形', 'ter', 'http://192.168.65.120:4090/iserver/services/3D-twin-city/rest/realspace/datas/DEM', '', '', '', '[]');
INSERT INTO "public"."layer_manage" VALUES ('1777866398412853249', '白膜', 'simpleBuild', 'http://192.168.65.120:4090/iserver/services/3D-twin-city/rest/realspace/datas/build/config', '', '', '', '[]');
INSERT INTO "public"."layer_manage" VALUES ('1783698150507212802', '影像', 'img', 'http://192.168.65.120:4090/iserver/services/map-ugcv5-MapYX/rest/maps/MapYX', '', '', '', '[]');
INSERT INTO "public"."layer_manage" VALUES ('1783369582988300290', '倾斜', 'osgb', 'http://192.168.65.120:4090/iserver/services/3D-twin-city/rest/realspace/datas/Combine/config', '', '', '', '[]');
INSERT INTO "public"."layer_manage" VALUES ('1783744820003532802', '索菲亚大教堂倾斜数据', 'osgb', 'http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace/datas/Config/config', '', '', '', '[]');

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_dept";
CREATE TABLE "public"."sys_dept" (
  "did" varchar(254) COLLATE "pg_catalog"."default" NOT NULL,
  "dname" varchar(254) COLLATE "pg_catalog"."default",
  "dparent" varchar(254) COLLATE "pg_catalog"."default",
  "dleaf" int4,
  "dcreated" date,
  "dupdated" date,
  "dnotes" varchar(254) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO "public"."sys_dept" VALUES ('1701869121278414850', '部门2', '1701869081021485057', 1, '2023-09-13', '2024-01-25', NULL);
INSERT INTO "public"."sys_dept" VALUES ('1701869174487355393', '部门1', '1701805039837851650', 1, '2023-09-13', '2023-12-01', NULL);
INSERT INTO "public"."sys_dept" VALUES ('1701805039837851650', '总部门', NULL, 0, '2023-09-13', NULL, NULL);
INSERT INTO "public"."sys_dept" VALUES ('1701869081021485057', '总部门2', NULL, 0, '2023-09-13', '2024-01-25', NULL);
INSERT INTO "public"."sys_dept" VALUES ('1768535874657595394', '部门11', '1701805039837851650', 1, '2024-03-15', NULL, '部门11');

-- ----------------------------
-- Table structure for sys_dept_user
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_dept_user";
CREATE TABLE "public"."sys_dept_user" (
  "did" varchar(254) COLLATE "pg_catalog"."default",
  "uid" varchar(254) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of sys_dept_user
-- ----------------------------
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1237609205771284481');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869081021485057', '1702498190395240449');
INSERT INTO "public"."sys_dept_user" VALUES ('1735601337434914817', '1735601337132924930');
INSERT INTO "public"."sys_dept_user" VALUES ('1735601380552359937', '1735601380095180802');
INSERT INTO "public"."sys_dept_user" VALUES ('1735601422835138561', '1735601422638006273');
INSERT INTO "public"."sys_dept_user" VALUES ('1735601455861088257', '1735601455471017986');
INSERT INTO "public"."sys_dept_user" VALUES ('1735601511217512450', '1735601510894551042');
INSERT INTO "public"."sys_dept_user" VALUES ('1735601546026041346', '1735601545698885633');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1768090027885101058');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1768091728675373057');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1237609508734251009');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1768144071546667009');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1769604363925340161');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '986177923098808322');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1769606820374003713');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1769607005133094913');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1237610590097125377');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1768114139391098882');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1769598439353610241');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1769644332442206209');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1776790346374594562');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1768113700209721345');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1776791485509812225');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1768085226552066050');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1783381169107177473');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1783380590591021058');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1783380695847079938');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1768086963933446146');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1768089923702784001');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1768085702551044098');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1730472041200558082');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1768093407009341441');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869121278414850', '1768166107077693442');
INSERT INTO "public"."sys_dept_user" VALUES ('1701869174487355393', '1769533397253877761');

-- ----------------------------
-- Table structure for sys_log
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_log";
CREATE TABLE "public"."sys_log" (
  "id" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
  "uname" varchar COLLATE "pg_catalog"."default",
  "url" varchar COLLATE "pg_catalog"."default",
  "ip" varchar COLLATE "pg_catalog"."default",
  "creat_time" date,
  "class_name" varchar COLLATE "pg_catalog"."default",
  "return_value" text COLLATE "pg_catalog"."default",
  "method_name" varchar COLLATE "pg_catalog"."default",
  "method_params" varchar COLLATE "pg_catalog"."default",
  "exception_type" varchar COLLATE "pg_catalog"."default",
  "message" varchar COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of sys_log
-- ----------------------------
INSERT INTO "public"."sys_log" VALUES ('1777876766027677697', 'admin', '/twin/sys_dept/list', '192.168.65.107', '2024-04-10', 'com.young.controller.SysDeptController', '{"msg":"ok","code":200,"succ":true,"data":[{"children":[{"children":[],"dcreated":1694534400000,"did":"1701869174487355393","dleaf":1,"dname":"部门1","dparent":"1701805039837851650","dupdated":1701360000000,"page":0,"pageSize":0},{"children":[],"dcreated":1710432000000,"did":"1768499472104423425","dleaf":1,"dname":"部门11","dnotes":"部门11","dparent":"1701805039837851650","page":0,"pageSize":0},{"children":[],"dcreated":1710432000000,"did":"1768535874657595394","dleaf":1,"dname":"部门11","dnotes":"部门11","dparent":"1701805039837851650","page":0,"pageSize":0}],"dcreated":1694534400000,"did":"1701805039837851650","dleaf":0,"dname":"总部门","page":0,"pageSize":0},{"children":[{"children":[],"dcreated":1694534400000,"did":"1701869121278414850","dleaf":1,"dname":"部门2","dparent":"1701869081021485057","dupdated":1706112000000,"page":0,"pageSize":0}],"dcreated":1694534400000,"did":"1701869081021485057","dleaf":0,"dname":"总部门2","dupdated":1706112000000,"page":0,"pageSize":0}],"oper":"success"}', 'exclude', '[{"children":[],"dleaf":0,"page":0,"pageSize":0}]', NULL, NULL);
INSERT INTO "public"."sys_log" VALUES ('1777876766027677698', 'admin', '/twin/sys_param_data/list', '192.168.65.107', '2024-04-10', 'com.young.controller.SysParamDataController', '{"msg":"ok","code":200,"succ":true,"data":{"current":1,"hitCount":false,"optimizeCountSql":true,"orders":[],"pages":1,"records":[{"created":1710432000000,"describe":"白模1","dictKey":"simpleBuild","dictType":"layer","dictValue":"白模1","id":"1768535801278246913","page":0,"pageSize":0},{"created":1710432000000,"dictType":"测试键类型","id":"1768535752527851522","page":0,"pageSize":0},{"created":1710432000000,"dictType":"测试键类型","id":"1768539055714217986","page":0,"pageSize":0},{"created":1710432000000,"dictType":"2","id":"1768539433188995074","page":0,"pageSize":0},{"created":1710432000000,"describe":"测试","dictKey":"simpleBuild","dictType":"label","dictValue":"测试","id":"1768540074925895682","page":0,"pageSize":0},{"created":1710432000000,"describe":"测试","dictKey":"simpleBuild","dictType":"dictType","dictValue":"测试","id":"1768540286549504002","page":0,"pageSize":0},{"created":1710086400000,"describe":"倾斜","dictKey":"osgb","dictType":"layer","dictValue":"倾斜","id":"3","page":0,"pageSize":0,"updated":1710086400000},{"created":1710086400000,"describe":"影像","dictKey":"img","dictType":"layer","dictValue":"影像","id":"4","page":0,"pageSize":0,"updated":1710086400000},{"created":1710086400000,"describe":"地形","dictKey":"ter","dictType":"layer","dictValue":"地形","id":"5","page":0,"pageSize":0,"updated":1710086400000},{"created":1710086400000,"describe":"开敞度","dictKey":"key1","dictType":"label","dictValue":"开敞度","id":"6","page":0,"pageSize":0,"updated":1710086400000},{"created":1710086400000,"describe":"白模","dictKey":"simpleBuild","dictType":"layer","dictValue":"白模","id":"1","page":0,"pageSize":0,"updated":1710086400000},{"created":1710086400000,"describe":"小品","dictKey":"key2","dictType":"label","dictValue":"小品","id":"7","page":0,"pageSize":0,"updated":1710086400000},{"created":1710086400000,"describe":"开敞度分析","dictKey":"key3","dictType":"label","dictValue":"开敞度分析","id":"8","page":0,"pageSize":0,"updated":1710086400000},{"created":1710086400000,"describe":"通视","dictKey":"key4","dictType":"label","dictValue":"通视","id":"9","page":0,"pageSize":0,"updated":1710086400000},{"created":1710086400000,"describe":"天际线","dictKey":"key5","dictType":"label","dictValue":"天际线","id":"10","page":0,"pageSize":0,"updated":1710086400000},{"created":1710086400000,"describe":"精模","dictKey":"build","dictType":"layer","dictValue":"精模","id":"2","page":0,"pageSize":0,"updated":1710086400000}],"searchCount":true,"size":999,"total":16},"oper":"success"}', 'list', '[{"page":0,"pageSize":999}]', NULL, NULL);
INSERT INTO "public"."sys_log" VALUES ('1777876766027677699', 'admin', '/twin/layer_manage/list', '192.168.65.107', '2024-04-10', 'com.young.controller.LayerManageController', '{"msg":"ok","code":200,"succ":true,"data":{"current":1,"hitCount":false,"optimizeCountSql":true,"orders":[],"pages":1,"records":[{"apiDataUrl":"2","deptList":[{"children":[],"did":"1701869121278414850","dleaf":0,"dname":"部门2","page":0,"pageSize":0}],"fieldsMap":{"type":"json","value":"[{\"a\": \"1\"}, {\"b\": \"2\"}]"},"gisDataKey":"2","gisDataUrl":"2","id":"1777627254331838465","layerName":"精模","page":0,"pageSize":0,"type":"build","url":"2"},{"apiDataUrl":"","deptList":[{"children":[],"did":"1701869121278414850","dleaf":0,"dname":"部门2","page":0,"pageSize":0},{"children":[],"did":"1701869174487355393","dleaf":0,"dname":"部门1","page":0,"pageSize":0}],"fieldsMap":{"type":"json","value":"[{\"1\": \"2\"}, {\"2\": \"3\"}]"},"gisDataKey":"","gisDataUrl":"","id":"1777869286912634882","layerName":"地形","page":0,"pageSize":0,"type":"ter","url":""},{"apiDataUrl":"12","deptList":[{"children":[],"did":"1701869174487355393","dleaf":0,"dname":"部门1","page":0,"pageSize":0},{"children":[],"did":"1768499472104423425","dleaf":0,"dname":"部门11","page":0,"pageSize":0}],"fieldsMap":{"type":"json","value":"[{\"a\": \"b\"}, {\"c\": \"d\"}]"},"gisDataKey":"12","gisDataUrl":"12","id":"1777866398412853249","layerName":"白膜","page":0,"pageSize":0,"type":"simpleBuild","url":"12"},{"apiDataUrl":"1","deptList":[{"children":[],"did":"1701869121278414850","dleaf":0,"dname":"部门2","page":0,"pageSize":0}],"fieldsMap":{"type":"json","value":"[]"},"gisDataKey":"1","gisDataUrl":"1","id":"1777874146575777793","layerName":"白模2","page":0,"pageSize":0,"type":"simpleBuild","url":"asdjlkadsjklasjklsa"}],"searchCount":true,"size":999,"total":4},"oper":"query layerManageList"}', 'exclude', '[{"page":0,"pageSize":999}]', NULL, NULL);
INSERT INTO "public"."sys_log" VALUES ('1778330619042869249', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330625401434114', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330651406118914', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330658205085697', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330660562284545', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330661606666242', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330662449721346', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330663242444801', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330664085499905', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330681101791234', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330684440457218', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330685354815489', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330726106673153', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330730032541698', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊分析\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330810949054465', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330840942522369', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778330866238369794', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"label\",\"dictKey\":\"viewShed\",\"dictValue\":\"视廊\",\"describe\":\"视廊\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778331045746192386', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"9\",\"dictType\":\"1\",\"dictKey\":\"1\",\"dictValue\":\"1\",\"describe\":\"1\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-03-11 00:00:00\",\"updated\":\"2024-03-11 00:00:00\",\"page\":0,\"pageSize\":0,\"key\":\"989cec5230e445a7b6035435d5f9a8a4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created, updated )  VALUES  ( ?, ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(9) already exists.');
INSERT INTO "public"."sys_log" VALUES ('1778331641928757249', 'admin', '/twin/sys_param_data', '192.168.65.107', '2024-04-11', 'com.young.controller.SysParamDataController', '', 'add', '["{\"id\":\"1778331518431670273\",\"dictType\":\"label\",\"dictKey\":\"11\",\"dictValue\":\"1\",\"describe\":\"1\",\"rid\":\"\",\"rname\":\"\",\"rval\":\"\",\"created\":\"2024-04-11 00:00:00\",\"updated\":null,\"page\":0,\"pageSize\":0,\"key\":\"f87f96ed6e434c588b7635574ab66ff4\"}"]', 'org.springframework.dao.DuplicateKeyException', '
### Error updating database.  Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(1778331518431670273) already exists.
### The error may exist in com/young/dao/SysParamDataMapper.java (best guess)
### The error may involve com.young.dao.SysParamDataMapper.insert-Inline
### The error occurred while setting parameters
### SQL: INSERT INTO sys_param_data  ( id, dict_type, dict_key, dict_value, describe, created )  VALUES  ( ?, ?, ?, ?, ?, ? )
### Cause: org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(1778331518431670273) already exists.
; ]; ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(1778331518431670273) already exists.; nested exception is org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint "sys_param_data_pkey"
  详细：Key (id)=(1778331518431670273) already exists.');

-- ----------------------------
-- Table structure for sys_param_data
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_param_data";
CREATE TABLE "public"."sys_param_data" (
  "id" varchar(32) COLLATE "pg_catalog"."default" NOT NULL,
  "dict_type" varchar(255) COLLATE "pg_catalog"."default",
  "dict_key" varchar(255) COLLATE "pg_catalog"."default",
  "dict_value" varchar(255) COLLATE "pg_catalog"."default",
  "created" date,
  "updated" date,
  "describe" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of sys_param_data
-- ----------------------------
INSERT INTO "public"."sys_param_data" VALUES ('1768535752527851522', '测试键类型', NULL, NULL, '2024-03-15', NULL, NULL);
INSERT INTO "public"."sys_param_data" VALUES ('1768539055714217986', '测试键类型', NULL, NULL, '2024-03-15', NULL, NULL);
INSERT INTO "public"."sys_param_data" VALUES ('1768539433188995074', '2', NULL, NULL, '2024-03-15', NULL, NULL);
INSERT INTO "public"."sys_param_data" VALUES ('1768540286549504002', 'dictType', 'simpleBuild', '测试', '2024-03-15', NULL, '测试');
INSERT INTO "public"."sys_param_data" VALUES ('1780846783652499458', '书签类型', 'height', '高度测量', '2024-04-18', NULL, '量算-高度测量');
INSERT INTO "public"."sys_param_data" VALUES ('6', '书签类型', 'viewDome', '开敞度', '2024-03-11', '2024-04-11', '开敞度');
INSERT INTO "public"."sys_param_data" VALUES ('10', '书签类型', 'skyLine', '天际线', '2024-03-11', '2024-04-11', '天际线');
INSERT INTO "public"."sys_param_data" VALUES ('7', '书签类型', 'sceneDrawn', '小品', '2024-03-11', '2024-04-11', '小品');
INSERT INTO "public"."sys_param_data" VALUES ('9', '书签类型', 'interVisibility', '通视', '2024-03-11', '2024-04-11', '通视');
INSERT INTO "public"."sys_param_data" VALUES ('1778331518431670273', '书签类型', 'viewShed', '视廊', '2024-04-11', '2024-04-11', '视廊视廊');
INSERT INTO "public"."sys_param_data" VALUES ('1780758933795835905', '书签类型', 'shade', '阴影分析', '2024-04-18', NULL, '阴影分析');
INSERT INTO "public"."sys_param_data" VALUES ('1780772310312095746', '书签类型', 'slop', '坡度分析', '2024-04-18', NULL, '坡度分析');
INSERT INTO "public"."sys_param_data" VALUES ('1780777827092729858', '书签类型', 'boxCrop', 'Box裁剪', '2024-04-18', '2024-04-18', 'Box裁剪');
INSERT INTO "public"."sys_param_data" VALUES ('1780826944015765506', '书签类型', 'crossCrop', 'Cross裁剪', '2024-04-18', '2024-04-18', 'CrossCrop');
INSERT INTO "public"."sys_param_data" VALUES ('1780846430529851393', '书签类型', 'distance', '距离测量', '2024-04-18', NULL, '量算-距离测量');
INSERT INTO "public"."sys_param_data" VALUES ('1780846688555044865', '书签类型', 'area', '面积测量', '2024-04-18', NULL, '量算-面积测量');
INSERT INTO "public"."sys_param_data" VALUES ('1', '图层类型', 'simpleBuild', '白模', '2024-03-11', '2024-03-11', '白模');
INSERT INTO "public"."sys_param_data" VALUES ('2', '图层类型', 'build', '精模', '2024-03-11', '2024-03-11', '精模');
INSERT INTO "public"."sys_param_data" VALUES ('3', '图层类型', 'osgb', '倾斜', '2024-03-11', '2024-03-11', '倾斜');
INSERT INTO "public"."sys_param_data" VALUES ('4', '图层类型', 'img', '影像', '2024-03-11', '2024-03-11', '影像');
INSERT INTO "public"."sys_param_data" VALUES ('5', '图层类型', 'ter', '地形', '2024-03-11', '2024-03-11', '地形');

-- ----------------------------
-- Table structure for sys_param_type
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_param_type";
CREATE TABLE "public"."sys_param_type" (
  "param_id" varchar(32) COLLATE "pg_catalog"."default" NOT NULL,
  "param_name" varchar(255) COLLATE "pg_catalog"."default",
  "dict_type" varchar(255) COLLATE "pg_catalog"."default",
  "created" date,
  "updated" date
)
;

-- ----------------------------
-- Records of sys_param_type
-- ----------------------------
INSERT INTO "public"."sys_param_type" VALUES ('2', '书签类型', '书签类型', '2024-03-11', '2024-04-22');
INSERT INTO "public"."sys_param_type" VALUES ('1', '图层类型', '图层类型', '2024-03-11', '2024-04-22');
INSERT INTO "public"."sys_param_type" VALUES ('1768555245878734849', '已删除', '已删除', '2023-12-01', NULL);

-- ----------------------------
-- Table structure for sys_perm
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_perm";
CREATE TABLE "public"."sys_perm" (
  "pval" varchar(254) COLLATE "pg_catalog"."default" NOT NULL,
  "parent" varchar(254) COLLATE "pg_catalog"."default",
  "pname" varchar(254) COLLATE "pg_catalog"."default",
  "ptype" int4,
  "leaf" int4,
  "created" date,
  "updated" date
)
;

-- ----------------------------
-- Records of sys_perm
-- ----------------------------
INSERT INTO "public"."sys_perm" VALUES ('m:sys:perm', 'm:sys', '权限管理', 1, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('m:sys:role', 'm:sys', '角色管理', 1, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('m:sys:user', 'm:sys', '用户管理', 1, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('m:sys:paramType', 'm:sys', '字典键管理', 1, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('m:sys:paramData', 'm:sys', '字典值管理', 1, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('m:sys:dept', 'm:sys', '部门管理', 1, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('*', NULL, '所有权限', NULL, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('a:sys:perm', NULL, '系统权限模块', 3, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('a:sys:role', NULL, '系统角色模块', 3, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('m:sys', NULL, '系统模块', 1, NULL, '2024-03-11', '2024-03-11');
INSERT INTO "public"."sys_perm" VALUES ('a:auth', NULL, '登录模块', 3, NULL, '2024-03-11', '2024-03-11');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_role";
CREATE TABLE "public"."sys_role" (
  "rid" varchar(254) COLLATE "pg_catalog"."default" NOT NULL,
  "rname" varchar(254) COLLATE "pg_catalog"."default",
  "rdesc" varchar(254) COLLATE "pg_catalog"."default",
  "rval" varchar(254) COLLATE "pg_catalog"."default",
  "created" date,
  "updated" date
)
;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO "public"."sys_role" VALUES ('1768437404248592386', '省级管理员', '拥有县级市管理权限，地市类型为0', '省级管理员', '2024-03-15', '2024-03-15');
INSERT INTO "public"."sys_role" VALUES ('1768204094859661314', '县级市管理员', '拥有县级市管理权限，地市类型为2', '县级市管理员', '2024-03-14', '2024-03-15');
INSERT INTO "public"."sys_role" VALUES ('999999888888777777', '超级管理员', '具有本系统中最高权限', '超级管理员', '2018-04-19', NULL);
INSERT INTO "public"."sys_role" VALUES ('1237601732188450817', '地级市管理员', '拥有地级市管理权限，地市类型为1', '地级市管理员', '2020-03-11', NULL);
INSERT INTO "public"."sys_role" VALUES ('1783399712578121729', '普通管理员', '仅可查看图层书签和数据', '普通管理员', '2024-04-25', NULL);

-- ----------------------------
-- Table structure for sys_role_perm
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_role_perm";
CREATE TABLE "public"."sys_role_perm" (
  "role_id" varchar(254) COLLATE "pg_catalog"."default",
  "perm_val" varchar(254) COLLATE "pg_catalog"."default",
  "perm_type" int4
)
;

-- ----------------------------
-- Records of sys_role_perm
-- ----------------------------
INSERT INTO "public"."sys_role_perm" VALUES ('1237601376658272258', 'b:user:query', 2);
INSERT INTO "public"."sys_role_perm" VALUES ('1237601376658272258', 'm:sys:user', 1);
INSERT INTO "public"."sys_role_perm" VALUES ('1237601732188450817', 'b:user:query', 2);
INSERT INTO "public"."sys_role_perm" VALUES ('1237601732188450817', 'm:sys:user', 1);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'a:sys:org', 3);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'a:sys:org:add', 3);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'a:sys:org:del', 3);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'a:sys:org:queryById', 3);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'a:sys:org:queryList', 3);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'a:sys:org:queryOrgParent', 3);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'a:sys:org:updateOrg', 3);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'm:menu3', 1);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'm:menu3:1', 1);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'm:menu3:2', 1);
INSERT INTO "public"."sys_role_perm" VALUES ('1702145524989218817', 'm:menu3:3', 1);
INSERT INTO "public"."sys_role_perm" VALUES ('999999888888777777', '*', NULL);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_user";
CREATE TABLE "public"."sys_user" (
  "uid" varchar(254) COLLATE "pg_catalog"."default" NOT NULL,
  "uname" varchar(254) COLLATE "pg_catalog"."default",
  "nick" varchar(254) COLLATE "pg_catalog"."default",
  "pwd" varchar(254) COLLATE "pg_catalog"."default",
  "salt" varchar(254) COLLATE "pg_catalog"."default",
  "avatar" text COLLATE "pg_catalog"."default",
  "created" date,
  "updated" date
)
;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO "public"."sys_user" VALUES ('986177923098808322', 'admin', '超级管理员', 'YWRtaW4=', 'AWbhslfzdfrnKGVL7NPYhg==', '', '2018-04-17', '2024-03-18');
INSERT INTO "public"."sys_user" VALUES ('1783380590591021058', 'testLayer', '测试图层', 'dGVzdExheWVy', 'AWbhslfzdfrnKGVL7NPYhg==', '', '2024-04-25', '2024-04-25');
INSERT INTO "public"."sys_user" VALUES ('1783380695847079938', 'testLayer2', '测试图层2', 'dGVzdExheWVyMg==', 'AWbhslfzdfrnKGVL7NPYhg==', '', '2024-04-25', '2024-04-25');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS "public"."sys_user_role";
CREATE TABLE "public"."sys_user_role" (
  "user_id" varchar(254) COLLATE "pg_catalog"."default",
  "role_id" varchar(254) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO "public"."sys_user_role" VALUES ('986177923098808322', '999999888888777777');
INSERT INTO "public"."sys_user_role" VALUES ('1783380590591021058', '1768437404248592386');
INSERT INTO "public"."sys_user_role" VALUES ('1783380695847079938', '1768204094859661314');

-- ----------------------------
-- Primary Key structure for table data_book
-- ----------------------------
ALTER TABLE "public"."data_book" ADD CONSTRAINT "data_book_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table data_manage
-- ----------------------------
ALTER TABLE "public"."data_manage" ADD CONSTRAINT "data_manage_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table layer_manage
-- ----------------------------
ALTER TABLE "public"."layer_manage" ADD CONSTRAINT "layer_manage_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table sys_dept
-- ----------------------------
ALTER TABLE "public"."sys_dept" ADD CONSTRAINT "sys_dept_pkey" PRIMARY KEY ("did");

-- ----------------------------
-- Primary Key structure for table sys_log
-- ----------------------------
ALTER TABLE "public"."sys_log" ADD CONSTRAINT "sys_log_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table sys_param_data
-- ----------------------------
ALTER TABLE "public"."sys_param_data" ADD CONSTRAINT "sys_param_data_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table sys_param_type
-- ----------------------------
ALTER TABLE "public"."sys_param_type" ADD CONSTRAINT "sys_param_type_pkey" PRIMARY KEY ("param_id");

-- ----------------------------
-- Primary Key structure for table sys_perm
-- ----------------------------
ALTER TABLE "public"."sys_perm" ADD CONSTRAINT "sys_perm_pkey" PRIMARY KEY ("pval");

-- ----------------------------
-- Primary Key structure for table sys_role
-- ----------------------------
ALTER TABLE "public"."sys_role" ADD CONSTRAINT "sys_role_pkey" PRIMARY KEY ("rid");

-- ----------------------------
-- Primary Key structure for table sys_user
-- ----------------------------
ALTER TABLE "public"."sys_user" ADD CONSTRAINT "sys_user_pkey" PRIMARY KEY ("uid");
