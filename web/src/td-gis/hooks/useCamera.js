

export function useCamera() {
    function flyHome(duration) {
        viewer.scene.camera.flyHome(duration)
    }
    function flyTo(options) {
        viewer.scene.camera.flyTo(options)
    }
    function setView(options) {
        viewer.scene.camera.setView(options)
    }

    return { flyHome, flyTo, setView }
}