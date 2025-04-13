export function useScene() {
    function setSkyBox(options) {
        viewer.scene.skyBox = new Cesium.SkyBox({
            sources: {
                positiveX: options.px,
                negativeX: options.nx,
                positiveY: options.py,
                negativeY: options.ny,
                positiveZ: options.pz,
                negativeZ: options.nz,
            },
        });
        viewer.scene.skyAtmosphere.show = true;
    }
    return { setSkyBox }
}