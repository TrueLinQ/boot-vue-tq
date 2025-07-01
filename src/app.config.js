const AppConfig = require("./@common/AppConfig");

module.exports = AppConfig.extend({
  apps: {
    chat: {
      // entry: "./src/main.js",
      // template: "public/app-customer.html",
      // filename: "app-customer.html",
      // title: "Customer Aapp",
      // chunks: ["chunk-vendors", "chunk-common", "customer"],
      component: () => import("@/app-chat/AppChat.vue"),
      context: "/chat",
      entry: "./src/main.js",
    },
    scriptus: {
      // entry: "./src/main.js",
      // template: "public/app-customer.html",
      // filename: "app-customer.html",
      // title: "Customer Aapp",
      // chunks: ["chunk-vendors", "chunk-common", "customer"],
      component: () => import("@/app-scriptus/AppScriptus.vue"),
      context: "/scriptus",
      entry: "./src/main.js",
    },
    tuber: {
      // entry: "./src/main.js",
      // template: "public/app-customer.html",
      // filename: "app-customer.html",
      // title: "Customer Aapp",
      // chunks: ["chunk-vendors", "chunk-common", "customer"],
      component: () => import("@/app-tuber/AppTuber.vue"),
      context: "/tuber",
      entry: "./src/main.js",
    },
    "linq/card": {
      // entry: "./src/main.js",
      // template: "public/app-customer.html",
      // filename: "app-customer.html",
      // title: "Customer Aapp",
      //chunks: ["chunk-vendors", "chunk-common", "customer"],
      component: () => import("@/app-linq-card/AppLinqCard.vue"),
      context: "/linq/card",
      entry: './src/main.js',
    },
    "truepilot": {
      // entry: "./src/main.js",
      // template: "public/app-customer.html",
      // filename: "app-customer.html",
      // title: "Customer Aapp",
      //chunks: ["chunk-vendors", "chunk-common", "customer"],
      component: () => import("@/app-truepilot/AppTruePilot.vue"),
      context: "/truepilot",
      entry: './src/main.js',
    },
    work: {
      // entry: "./src/main.js",
      // template: "public/app-customer.html",
      // filename: "app-customer.html",
      // title: "Customer Aapp",
      //chunks: ["chunk-vendors", "chunk-common", "customer"],
      component: () => import("@/app-work/AppWork.vue"),
      context: "/work",
      entry: './src/main.js',
    },
    default: {
      component: () => import("@/app/App.vue"),
      context: "/",
      entry: "./src/main.js",
    },
  },
  server : {
    port: 8080,
  }
});
