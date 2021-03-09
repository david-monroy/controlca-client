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
      component: () => import("../components/projects/ProjectsList.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../views/users/UsersList.vue"),
    },
    {
      path: "/users-add",
      name: "users-add",
      component: () => import("../views/auth/Register.vue"),
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