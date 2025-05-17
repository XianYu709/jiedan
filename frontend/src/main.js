import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "vant/lib/index.css";
import { showLoadingToast } from "vant";
import axios from "axios";

const app = createApp(App);
app.use(router);
app.mount("#app");

const loadingUrlKeywords = ["alicloudapi", "apimy"];

function shouldShowLoading(url) {
  return loadingUrlKeywords.some((keyword) => url.includes(keyword));
}

let toast;

axios.interceptors.request.use(
  (config) => {
    if (config.url && shouldShowLoading(config.url)) {
      toast = showLoadingToast({
        message: "加载中...",
        forbidClick: true,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    toast && toast.close();
    return response;
  },
  (error) => {
    toast && toast.close();
    return Promise.reject(error);
  }
);
