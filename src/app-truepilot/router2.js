import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ReviewsPage from '@/views/ReviewsPage.vue';
import CompanyPage from '@/views/CompanyPage.vue'; // This is a placeholder for a specific company page
import PostAdPage from '@/views/PostAdPage.vue'; // New route for Post Ad
import SignInPage from '@/views/SignInPage.vue';
import WriteReviewPage from '@/views/WriteReviewPage.vue';
import ExploreCategoryPage from '@/views/ExploreCategoryPage.vue';
import CreateCompanyPage from '@/views/CreateCompanyPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/reviews',
    name: 'Reviews',
    component: ReviewsPage,
  },
  {
    path: '/business',
    name: 'Business',
    // Assuming 'Business' refers to managing a company profile. You might
    // want a more specific path, e.g., '/business/dashboard'
    component: CompanyPage, // Reusing CompanyPage for now, adjust as needed
  },
  {
    path: '/company/:id', // Example for a dynamic company page
    name: 'CompanyDetails',
    component: CompanyPage,
    props: true, // Allows passing route params as props to the component
  },
  {
    path: '/post-ad',
    name: 'PostAd',
    component: PostAdPage,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInPage,
  },
  {
    path: '/write-review',
    name: 'WriteReview',
    component: WriteReviewPage,
  },
  {
    path: '/explore-categories',
    name: 'ExploreCategories',
    component: ExploreCategoryPage,
  },
  {
    path: '/explore-categories/:category', // Route for specific category
    name: 'ExploreCategory',
    component: ExploreCategoryPage,
    props: true,
  },
  {
    path: '/create-company',
    name: 'CreateCompany',
    component: CreateCompanyPage,
    props: (route) => ({ company: route.query.company }), // Pass query param 'company' as prop
  },
  // Catch-all route for 404
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    redirect: '/', // Or a dedicated 404 component
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;