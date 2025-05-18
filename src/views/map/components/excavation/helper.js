export const useKW = () => {
  const viewer = window.viewer;
  const Cesium = window.Cesium;
  let handlerPolygon = null;
  let entities = [];

  const start = (depth) => {
    clear();
    handlerPolygon ??= new Cesium.DrawHandler(
      viewer,
      Cesium.DrawMode.Polygon,
      0
    );

    handlerPolygon.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
      } else {
        viewer.enableCursorStyle = true;
      }
    });

    handlerPolygon.drawEvt.addEventListener(function (result) {
      if (!result.object.positions) {
        handlerPolygon.polygon.show = false;
        handlerPolygon.polyline.show = false;
        handlerPolygon.deactivate();
        handlerPolygon.activate();
        return;
      }

      var array = [].concat(result.object.positions);
      var positions = [];
      for (var i = 0, len = array.length; i < len; i++) {
        var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var h = cartographic.height;
        if (
          positions.indexOf(longitude) == -1 &&
          positions.indexOf(latitude) == -1
        ) {
          positions.push(longitude);
          positions.push(latitude);
          positions.push(h);
        }
      }

      var dep = depth;

      viewer.scene.globe.removeAllExcavationRegion();
      viewer.scene.globe.addExcavationRegion({
        name: "excavation_" + Date.now(),
        position: positions,
        height: dep,
        transparent: false,
      });

      handlerPolygon.polygon.show = false;
      handlerPolygon.polyline.show = false;
      handlerPolygon.deactivate();
      handlerPolygon.activate();
    });

    handlerPolygon.activate();
  };

  const clear = () => {
    try {
      viewer.scene.globe.removeAllExcavationRegion();

      if (handlerPolygon) {
        handlerPolygon.activeEvt.removeEventListener();
        handlerPolygon.drawEvt.removeEventListener();

        handlerPolygon.polygon.show = false;
        handlerPolygon.polyline.show = false;
        handlerPolygon.clear();
        handlerPolygon.deactivate();
        handlerPolygon = null;
      }

      entities.forEach((item) => {
        if (item && !item.isDestroyed()) {
          viewer.entities.remove(item);
        }
      });
      entities = [];
    } catch (error) {}
  };

  return { start, clear };
};
export const useCC = () => {
  const viewer = window.viewer;
  const Cesium = window.Cesium;
  let handlerPolygon = null;
  let eventListeners = []; // 专门存储事件监听器

  const start = (depth, moveHeight) => {
    // 先清除之前的操作
    clear();

    const extract = (positions) => {
      viewer.scene.globe.removeAllExtractRegion();
      viewer.scene.globe.addExtractRegion({
        name: "extract_" + Date.now(), // 使用唯一名称
        position: positions,
        height: Number(depth),
        transparent: false,
        extractHeight: Number(moveHeight),
        granularity: 1,
      });
    };

    handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon);

    // 添加事件监听器并存储引用
    const activeListener = handlerPolygon.activeEvt.addEventListener(
      (isActive) => {
        viewer.enableCursorStyle = !isActive;
        viewer._element.style.cursor = isActive ? "" : "default";
      }
    );
    eventListeners.push({ handler: handlerPolygon, listener: activeListener });

    const drawListener = handlerPolygon.drawEvt.addEventListener((res) => {
      if (!res.object.positions) return;

      const positions = [];
      for (let i = 0; i < res.object.positions.length; i++) {
        const cartographic = Cesium.Cartographic.fromCartesian(
          res.object.positions[i]
        );
        positions.push(
          Cesium.Math.toDegrees(cartographic.longitude),
          Cesium.Math.toDegrees(cartographic.latitude),
          cartographic.height
        );
      }

      extract(positions);
      handlerPolygon.clear();
      handlerPolygon.deactivate();
    });
    eventListeners.push({ handler: handlerPolygon, listener: drawListener });

    handlerPolygon.activate();
  };

  const clear = () => {
    try {
      // 移除所有提取区域
      viewer.scene.globe.removeAllExtractRegion();

      // 移除所有事件监听器
      eventListeners.forEach(({ handler, listener }) => {
        try {
          if (handler && !handler.isDestroyed && !handler.isDestroyed()) {
            // 不同版本的Cesium可能有不同的事件移除方法
            if (handler.activeEvt.removeEventListener) {
              handler.activeEvt.removeEventListener(listener);
            }
            if (handler.drawEvt.removeEventListener) {
              handler.drawEvt.removeEventListener(listener);
            }
          }
        } catch (e) {
          console.warn("移除事件监听器时出错:", e);
        }
      });
      eventListeners = [];

      // 清理绘图处理器
      if (handlerPolygon) {
        try {
          handlerPolygon.deactivate();
          handlerPolygon.clear();
          // 某些版本的Cesium可能需要销毁处理器
          if (handlerPolygon.destroy) {
            handlerPolygon.destroy();
          }
        } catch (e) {
          console.warn("清理handlerPolygon时出错:", e);
        }
        handlerPolygon = null;
      }
    } catch (error) {
      console.error("清除过程中出错:", error);
    }
  };

  return { start, clear };
};
