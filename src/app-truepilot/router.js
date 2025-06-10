import { BootRouter } from "@/@common";
// import reviewRoutes from "../modules/reviews";
// import companyRoutes from "../modules/companies";
// import adRoutes from "../modules/ads";

export default BootRouter.route({
  app: "truepilot",
  base: "/truepilot/",
  routes: [
    {
      path: "/",
      name: "LandingPage",
      component: () => import("./pages/Landing.vue"),
    },
    // {
    //   path: "/login",
    //   name: "Login",
    //   component: () => import("../pages/Login.vue"),
    // },
    // {
    //   path: "/register",
    //   name: "Register",
    //   component: () => import("../pages/Register.vue"),
    // },
    // ...companyRoutes,
    // ...reviewRoutes,
    // ...adRoutes,
    // {
    //   path: "/:catchAll(.*)",
    //   name: "NotFound",
    //   component: () => import("../pages/NotFound.vue"),
    // },
    {
      path: "/review",
      name: "Login",
      component: () => import("./pages/ReviewForm.vue"),
    },
    {
      path: "/company",
      name: "Login",
      component: () => import("./pages/Company.vue"),
    },
    {
      path: "/viewcompany",
      name: "Login",
      component: () => import("./pages/ViewCompany.vue"),
    },
  ],
});
