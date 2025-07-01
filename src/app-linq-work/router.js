import { BootRouter } from "@/@common";

export default BootRouter.route({
  app: "linq/work",
  base: "/linq/work",
  routes: [
    {
      path: "/",
      name: "root",
      component: () => import("./random/CreateProfile.vue"),
    },
    {
      path: "/create",
      name: "create",
      component: () => import("./random/CreateProfile.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("./random/MyProfile.vue"),
    },
    // Dashboards
    // {
    //   path: "/home",
    //   name: "HomePage",
    //   component: () => import("./Modules/Home.vue"),
    // },
    // {
    //   path: "/@/v/:verificationId/m/:membershipId/card",
    //   name: "Card",
    //   component: () => import("./Modules/BusinessCard.vue"),
    // },
  ],
});
