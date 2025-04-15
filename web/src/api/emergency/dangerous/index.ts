import {defHttp} from '@/utils/http/axios';
import type {layerRequest} from './model/layerModel';

enum Api {
  RISKY_AREA_ADD = '/risky_area',
  RISKY_AREA_DEL = '/risky_area',
  RISKY_AREA_EDIT = '/risky_area',
  RISKY_AREA_LIST = '/risky_area/list',
}

const riskyAreaListApi = (params?: any) => defHttp.get<layerRequest>({
  url: Api.RISKY_AREA_LIST,
  params
});

const riskyAreaAddApi = (params?: any) => defHttp.post<layerRequest>({
  url: Api.RISKY_AREA_ADD,
  params
});

const riskyAreaEditApi = (params?: any) => defHttp.put<layerRequest>({
  url: Api.RISKY_AREA_EDIT,
  params
});

const riskyAreaDelApi = (params?: any) => defHttp.delete<layerRequest>({
  url: `${Api.RISKY_AREA_DEL}/${params}`,
});

export default {
  riskyAreaListApi,
  riskyAreaAddApi,
  riskyAreaDelApi,
  riskyAreaEditApi,
};
