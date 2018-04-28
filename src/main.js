import Vue from 'vue';
import App from './App.vue';
import LightBox from './index.js';
import './common/common.less';

Vue.use(LightBox);

new Vue({
	el: '#app',
	components: { App },
	template: '<App/>'
});

