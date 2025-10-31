import Vue  from "vue";
import App  from "./hello.vue";

new Vue({
	render: (h) => h(App, {
		attrs: {
		  color: "red"
		},
	  }),
}).$mount('#root');
