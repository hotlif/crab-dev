import Vue from "vue";
import App from "./test";
import { Vue2Adapter } from "@crab/rc-vue2";

new Vue({
	render: (h) => h(Vue2Adapter(App), {
		attrs: {
			name: "这是一个 React 组件"
		}
	}),
}).$mount('#root');
