// 服务域名
const iServerHost = 'http://www.startyoung.top:4091';

 // 时空影像服务地址
const collSuffix = '/iserver/services/imageservice-NephogramData/restjsr/search.json?collections=coll';
const collConfigSuffix = '/iserver/services/imageservice-NephogramData/wms130/coll';
 // 水文影像服务地址
const windlIserverSuffix = '/iserver/services/imageservice-NephogramData/restjsr/search.json?collections=windTif';
const windIserverConfigSuffix = '/iserver/services/imageservice-NephogramData/wms130/windTif';
// 气象影像服务地址
const templIserverSuffix = '/iserver/services/imageservice-NephogramData/restjsr/search.json?collections=tempTif';
const tempIserverConfigSuffix = '/iserver/services/imageservice-NephogramData/wms130/tempTif';

// 再在 GLOBAL_CONFIG 里引用它们
export const GLOBAL_CONFIG = {
    // 天地图底图地址
    layerUrl: 'https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China_4326',

    // 时空影像服务地址
    collIserverUrl: iServerHost + collSuffix,
    // 时空影像接口地址
    collIserverConfigUrl: iServerHost + collConfigSuffix,

    // 水文影像服务地址
    windlIserverUrl: iServerHost + windlIserverSuffix,
    // 水文影像接口地址
    windIserverConfigUrl: iServerHost + windIserverConfigSuffix,

    // 气象影像服务地址
    templIserverUrl: iServerHost + templIserverSuffix,
    // 气象影像接口地址
    tempIserverConfigUrl: iServerHost + tempIserverConfigSuffix
};