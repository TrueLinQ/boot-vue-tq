import { BootRouter } from "@/@common";

export default BootRouter.route({
  app: "linq/reviews",
  base: "/linq/reviews",
  routes: [
    {
      path: "/",
      name: "root",
      component: () => import("./features/helloworld.vue"),
    },
  ],
});
