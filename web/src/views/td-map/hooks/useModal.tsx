import {createSSRApp, defineComponent, h} from 'vue'
import {renderToString} from 'vue/server-renderer'
import {Radio, Row, Table} from "ant-design-vue";


const View = defineComponent({
  name: 'RoutePlanning',
  setup() {
    return () => (
      <>
        <Row>
          <p class="text-base font-bold">路线规划</p>
        </Row>
        <div class="text-[14px] -mt-2 mb-1">目标位置：</div>
        <Row>
          <Radio.Group>
            <Radio.Button value="医院">医院</Radio.Button>
            <Radio.Button value="防空洞">防空洞</Radio.Button>
            <Radio.Button value="避难所">避难所</Radio.Button>
            <Radio.Button value="消防站">消防站</Radio.Button>
          </Radio.Group>
        </Row>
        <Table class={'mt-1'}/>
      </>
    )
  },
})

export const useModalHtml = async (params: object) => {
  const app = createSSRApp(h(View, {...params}))
  return await renderToString(app);
};
