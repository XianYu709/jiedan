import * as components from "./components";
// import * as hooks from "./hooks";
import "./styles/index.less";

export * from './components';
// export * from './hooks'

const install = (app) => {
  Object.keys(components).forEach((key) => {
    const component = components[key];
    if (component.install) {
      app.use(component);
    }
  });

  return app;
};

export default { ...components, install };
