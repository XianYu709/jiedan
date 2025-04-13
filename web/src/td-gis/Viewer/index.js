import Viewer from "./Index.vue";
import "./index.less"

Viewer.install = function (app, options) {
    app.component(Viewer.name, Viewer);
    return app;
}

export default Viewer;
