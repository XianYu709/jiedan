const iServerHost = 'http://www.startyoung.top:4091';

export const GLOBAL_CONFIG = {
    // 天地图底图地址
    layerUrl: 'https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China_4326',

    // 服务域名
    iServerHost,

    // 时空影像服务地址
    collSuffix: '/iserver/services/imageservice-NephogramData/restjsr/search.json?collections=coll',
    collIserverUrl: iServerHost + '/iserver/services/imageservice-NephogramData/restjsr/search.json?collections=coll',

    // 时空影像接口地址
    collConfigSuffix: '/iserver/services/imageservice-NephogramData/wms130/coll',
    collIserverConfigUrl: iServerHost + '/iserver/services/imageservice-NephogramData/wms130/coll',

    // 水文影像服务地址
    windlIserverSuffix: '/iserver/services/imageservice-NephogramData/restjsr/search.json?collections=windTif',
    windlIserverUrl: iServerHost + '/iserver/services/imageservice-NephogramData/restjsr/search.json?collections=windTif',

    // 水文影像接口地址
    windIserverConfigSuffix: '/iserver/services/imageservice-NephogramData/wms130/windTif',
    windIserverConfigUrl: iServerHost + '/iserver/services/imageservice-NephogramData/wms130/windTif',

    // 气象影像服务地址
    templIserverSuffix: '/iserver/services/imageservice-NephogramData/restjsr/search.json?collections=tempTif',
    templIserverUrl: iServerHost + '/iserver/services/imageservice-NephogramData/restjsr/search.json?collections=tempTif',

    // 气象影响接口地址
    tempIserverConfigSuffix: '/iserver/services/imageservice-NephogramData/wms130/tempTif',
    tempIserverConfigUrl: iServerHost + '/iserver/services/imageservice-NephogramData/wms130/tempTif'
};
