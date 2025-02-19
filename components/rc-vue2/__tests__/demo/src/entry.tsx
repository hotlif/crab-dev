import Vue from "vue";
import App from "./test";
import { convertToVue2 } from "@crab/rc-vue2";

new Vue({
	render: (h) => h(convertToVue2(App), {
		attrs: {
			name: "这是一个 React 组件"
		}
	}),
}).$mount('#root');
