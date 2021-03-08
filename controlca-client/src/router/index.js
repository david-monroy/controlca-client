import Vue from "vue";
import Router from "vue-router";

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
    
  ]
});