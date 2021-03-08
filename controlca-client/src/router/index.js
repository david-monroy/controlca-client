import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/projects",
      alias: "/projects",
      name: "projects",
      component: () => import("./components/projects/ProjectsList")
    },
    {
      path: "/projects/:id",
      name: "project-details",
      component: () => import("./components/projects/Project")
    },
    {
      path: "/add",
      name: "add",
      component: () => import("./components/projects/AddProject")
    }
  ]
});