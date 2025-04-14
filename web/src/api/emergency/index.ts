import {defHttp} from '@/utils/http/axios';
import type {layerRequest} from './model/layerModel';

enum Api {
  DATA_EMERGENCY_ADD = '/data_emergency',
  DATA_EMERGENCY_DEL = '/data_emergency',
  DATA_EMERGENCY_EDIT = '/data_emergency',
  DATA_EMERGENCY_LIST = '/data_emergency/list',
}

const dataEmergencyListApi = (params?: any) => defHttp.get<layerRequest>({
  url: Api.DATA_EMERGENCY_LIST,
  params
});

const dataEmergencyAddApi = (params?: any) => defHttp.post<layerRequest>({
  url: Api.DATA_EMERGENCY_ADD,
  params
});

const dataEmergencyEditApi = (params?: any) => defHttp.put<layerRequest>({
  url: Api.DATA_EMERGENCY_EDIT,
  params
});

const dataEmergencyDelApi = (params?: any) => defHttp.delete<layerRequest>({
  url: `${Api.DATA_EMERGENCY_DEL}/${params}`,
});

export default {
  dataEmergencyListApi,
  dataEmergencyAddApi,
  dataEmergencyDelApi,
  dataEmergencyEditApi,
};
