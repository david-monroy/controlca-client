import Vue from "vue";
import Router from "vue-router";
import Login from '../views/auth/Login.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/Dashboard.vue"),
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
      path: '/login',
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/auth/Register.vue"),
    },
    
  ]
});