<template>
  <v-card 
  class="pa-4 ma-0 dashboard-card__item" 
  @click="goRoute(route)">
    <div class="dashboard-card__info text-center">
      <h4 class="dashboard-card__info-title">{{ name }}</h4>
      
    </div>
  </v-card>
</template>

<script>
export default {
  name: "DashboardCard",
  props: {
    name: String,
    icon: String,
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
.dashboard-card__item{
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width:200px;
    height:200px;
    transition: 0.5;
}
</style>