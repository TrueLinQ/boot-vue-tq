import { BootRouter } from "@/@common";

export default BootRouter.route({
  app: "linq/reviews",
  base: "/linq/reviews",
  routes: [
    {
      path: "/",
      name: "root",
      component: () => import("./features/HomePage.vue"),
    },
    {
      path: "/list",
      name: "list",
      component: () => import("./features/ListReviews.vue"),
    },
    {
      path: "/list2",
      name: "list2",
      component: () => import("./features/List2.vue"),
    },
    {
      path: "/create",
      name: "create",
      component: () => import("./features/WriteReview.vue"),
    },
    {
      path: "/company/:id",
      name: "company",
      component: () => import("./features/CompanyPage.vue"),
    },
  ],
});
