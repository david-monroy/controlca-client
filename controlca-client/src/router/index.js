import Vue from "vue";
import Router from "vue-router";
import Login from '../views/auth/Login.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/Dashboard.vue"),
    },
    {
      path: "/project_offer",
      name: "project_offer",
      component: () => import("../views/Project_Offer.vue"),
    },
    {
      path: "/projects",
      name: "projects",
      component: () => import("../views/projects/ProjectsList.vue"),
    },
    {
      path: "/projects-add",
      name: "projects-add",
      component: () => import("../views/projects/ProjectAdd.vue"),
    },
    {
      path: "/projects/:id",
      name: "projects-details",
      component: () => import("../views/projects/ProjectDetails.vue"),
    },
    {
      path: "/offers",
      name: "offers",
      component: () => import("../views/offers/OffersList.vue"),
    },
    {
      path: "/offers-add",
      name: "offers-add",
      component: () => import("../views/offers/OfferAdd.vue"),
    },
    {
      path: "/offers/:id",
      name: "offers-details",
      component: () => import("../views/offers/OfferDetails.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../views/users/UsersList.vue"),
    },
    {
      path: "/users-add",
      name: "users-add",
      component: () => import("../views/users/UserAdd.vue"),
    },
    {
      path: "/users/:id",
      name: "users-details",
      component: () => import("../views/users/UserDetail.vue"),
    },
    {
      path: "/loads",
      name: "load-dashboard",
      component: () => import("../views/loads/LoadDashboard.vue"),
    },
    {
      path: "/load-projects",
      name: "load-projects",
      component: () => import("../views/loads/LoadProjects.vue"),
    },
    {
      path: "/load-offers",
      name: "load-offers",
      component: () => import("../views/loads/LoadOffers.vue"),
    },
    {
      path: "/load-administration",
      name: "load-administration",
      component: () => import("../views/loads/LoadAdministration.vue"),
    },
    {
      path: "/reports",
      name: "reports",
      component: () => import("../views/reports/ReportsList.vue"),
    },
    {
      path: "/reports/:id",
      name: "project-report",
      component: () => import("../views/reports/ProjectReport.vue"),
    },
    {
      path: '/',
      component: Login
    },    
  ]
});