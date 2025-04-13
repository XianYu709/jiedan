const cartesianToCartographic = (cartesian) => {
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  const longitude = Cesium.Math.toDegrees(cartographic.longitude);
  const latitude = Cesium.Math.toDegrees(cartographic.latitude);
  const height = cartographic.height;
  return {
    longitude: longitude,
    latitude: latitude,
    height: height,
  };
};

export default (cartesians, type) => {
  if (type === 'model') {
    console.log(cartesians,type)
    return new Promise(async (resolve) => {
      try {
        let promise = viewer.scene.clampToHeightMostDetailed(cartesians);
        promise.then((updatedCartesians) => {
          let heightList = [];
          updatedCartesians.forEach((item) => {
            heightList.push(cartesianToCartographic(item).height);
          });
          resolve(heightList);
        });
      } catch (e) {
        resolve(false);
      }
    });
  } else if ((type = 'terrain')) {
    let positions = [];
    cartesians.forEach((cartesian) => {
      positions.push(Cesium.Cartographic.fromCartesian(cartesian));
    });
    let terrain = viewer.terrainProvider;
    return new Promise(async (resolve) => {
      try {
        if (!terrain) resolve(false);
        const promise = Cesium.sampleTerrainMostDetailed(terrain, positions);
        promise.then((updatedPositions) => {
          let resultCartesians = [];
          updatedPositions.forEach((position) => {
            resultCartesians.push(position.height);
          });
          resolve(resultCartesians);
        });
      } catch (e) {
        resolve(false);
      }
    });
  }
};
