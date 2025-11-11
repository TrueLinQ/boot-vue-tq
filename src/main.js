import './preloader'
import Vue from "vue";
//import App from "./App.vue";
import BootstrapVue, { BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js';
import { BootLoader } from "./@common";
import appConfig from "./app.config.js";

import './tailwind.css';


Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons)

console.log("AppConfig", appConfig);

new BootLoader(appConfig)
  .modules({
  })
  .mount();
