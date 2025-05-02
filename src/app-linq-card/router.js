import { BootRouter } from "@/@common";

export default BootRouter.route({
  app: "linq/card",
  base: "/linq/card",
  routes: [
    {
      path: "/",
      redirect: "/home",
      name: "root",
    },
    // Dashboards
    {
      path: "/home",
      name: "HomePage",
      component: () => import("./Modules/Home.vue"),
    },
    {
      path: "/@/v/:verificationId/m/:membershipId/card",
      name: "Card",
      component: () => import("./Modules/BusinessCard.vue"),
    },
  ],
});
