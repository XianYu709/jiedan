
export default {
  install(Vue) {
    Vue.directive("draggable", {
      mounted(el) {
        el.style.cursor = 'move'
        el.onmousedown = function (e) {
          const disX = e.clientX - el.offsetLeft;
          const disY = e.clientY - el.offsetTop;
          document.onmousemove = function (e) {
            const l = e.clientX - disX;
            const t = e.clientY - disY;
            el.style.left = l + "px";
            el.style.top = t + "px";
          };
          document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null;
          };
        };
      },
    });
  },
};
