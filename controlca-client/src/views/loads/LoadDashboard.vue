<template>
  <div id="load-dashboard">
    <v-card
    class="mx-auto load-dashboard-main-card"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" class="load-dashboard-item-list">
            <div
              v-for="item in dashItems"
              :key="item.id"
            >
              <LoadDashboardCard
                :name="item.name"
                :icon="item.icon"
                :route="item.route"
                class="text-center mb-5"
              >
              </LoadDashboardCard>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import LoadDashboardCard from "../../components/loads/LoadDashboardCard.vue";
export default {
  name: "LoadDashboard",
  components: {
    LoadDashboardCard
  },
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
  },
  data: () => ({
      dashItems: [
      {
        id: 1,
        name: "Proyectos",
        route: "load-projects",
      },
      {
        id: 2,
        name: "Ofertas",
        route: "load-offers",
      },
      {
        id: 2,
        name: "Administración",
        route: "load-admin",
      }
    ]
  })
};
</script>

<style>
  @import "../../styles/components/loadDashboard.css";
</style>