//图层裁剪
import PlanarCrop from "./PlanarCrop.vue";//平面裁剪
import BoxCrop from "./BoxCrop.vue";//Box裁剪
import Crop from "./index.vue";
import CrossCrop from "./CrossCrop.vue";//Cross裁剪
import PolygonCrop from "./PolygonCrop.vue";//多边形裁剪
import CropWithSeal from "./CropWithSeal.vue";//裁剪封边

import "./index.less";

export { PlanarCrop, BoxCrop, CrossCrop, PolygonCrop, CropWithSeal };
export default Crop;
