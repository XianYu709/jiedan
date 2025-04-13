import type { Component } from 'vue';

type params = {
  leftClick?: Function;
  layerReady?: Function;
};

type result = [Component, Object];

type addLayerParam = {
  name: string;
  url: string;
};

type addImageParam = {
  name: string;
  url: string;
};

export type { params, result, addLayerParam, addImageParam };
