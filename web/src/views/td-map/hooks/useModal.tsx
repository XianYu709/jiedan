import {createSSRApp, h} from 'vue'
import {renderToString} from 'vue/server-renderer'
const View=()=>{
  return <div>123</div>
}

export const useModalHtml = async (params: object) => {
  const app = createSSRApp(h(View, {...params}))
  return await renderToString(app);
};
