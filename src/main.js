import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { auth } from "./firebase";
import BootstrapVue from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/tema.css";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

let appPokrenuta = false;

auth.onAuthStateChanged(() => {
  if (!appPokrenuta) {
    appPokrenuta = true;
    new Vue({
      router,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
