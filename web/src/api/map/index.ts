import { defHttp } from '@/utils/http/axios';
import type { layerRequest } from './model/layerModel';

enum Api {
  LAYER_ADD = '/layer_manage',
  LAYER_DEL = '/layer_manage',
  LAYER_EDIT = '/layer_manage',
  LAYER_LIST = '/layer_manage/list',
}

const layerListApi = (params?: any) => defHttp.get<layerRequest>({ url: Api.LAYER_LIST, params });

const layerAddApi = (params?: any) => defHttp.post<layerRequest>({ url: Api.LAYER_ADD, params });

const layerEditApi = (params?: any) => defHttp.put<layerRequest>({ url: Api.LAYER_ADD, params });

const layerDelApi = (params?: any) => defHttp.delete<layerRequest>({ url: Api.LAYER_DEL, params });

export default {
  layerListApi,
  layerAddApi,
  layerDelApi,
  layerEditApi,
};
