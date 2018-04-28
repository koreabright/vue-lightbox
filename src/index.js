import OriginLightBox from './components/lightBox/LightBox.vue';   //引入组件
const LightBox = {
  install (Vue, options) {
    Vue.component('hs-light-box', OriginLightBox) //全局组件
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(LightBox)
}

export default LightBox;  //导出