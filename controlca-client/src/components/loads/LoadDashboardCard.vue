<template>
  <v-card 
  class="pa-4 ma-0 load-dashboard-card__item primary-color" 
  @click="goRoute(route)">
    <div class="text-center ">
      <h4 class="ma-0">{{ name }}</h4>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "LoadDashboardCard",
  props: {
    name: String,
    route: String,
  },
  methods: {
    goRoute(route) {
      this.$router.push("/" + route);
    },
  },
  data: () => ({}),
};
</script>

<style>
@import "../../styles/components/dashboard.css";
</style>