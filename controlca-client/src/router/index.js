import Vue from "vue";
import Router from "vue-router";
import Login from '../views/auth/Login.vue';
import Register from '../views/auth/Register.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "projects",
      component: () => import("../components/projects/ProjectsList.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../components/users/UsersList.vue"),
    },
    {
      path: "/users-add",
      name: "users-add",
      component: () => import("../components/users/UserAdd.vue"),
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    
  ]
});