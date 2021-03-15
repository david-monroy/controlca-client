<template>
  <v-card 
  class="pa-4 ma-0 dashboard-card__item" 
  @click="goRoute(route)">
    <div class="text-center">
        <v-icon size="60" color="white" class="mb-2">{{icon}}</v-icon>
      <h4 class="">{{ name }}</h4>
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
    width:240px;
    height:200px;
    background-color: #00917c !important;
    color: white !important;
    transition: 0.3s;
    margin: 14px  !important;
}

.dashboard-card__item:hover{
    background-color: #066B5D !important;
}
</style>