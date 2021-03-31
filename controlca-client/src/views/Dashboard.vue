<template>
  <div id="dashboard">
    <v-card
    class="mx-auto dashboard-main-card"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" class="dashboard-item-list">
            <div
              v-for="item in dashItems"
              :key="item.id"
            >
              <DashboardCard
                v-if="currentUser.rol_id <= item.rol"
                :name="item.name"
                :icon="item.icon"
                :route="item.route"
                class="text-center"
              >
              </DashboardCard>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import DashboardCard from "../components/dashboard/DashboardCard.vue";
export default {
  name: "Dashboard",
  components: {
    DashboardCard
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
        name: "Proyectos y Ofertas",
        icon: "mdi-folder-multiple",
        rol: 2,
        route: "project_offer",
      },
      {
        id: 2,
        name: "Usuarios",
        icon: "mdi-account-group",
        rol: 1,
        route: "users",
      },
      {
        id: 3,
        name: "Cargar Horas",
        icon: "mdi-progress-clock",
        rol: 3,
        route: "loads",
      },
      {
        id: 4,
        name: "Reportes",
        icon: "mdi-align-vertical-bottom",
        rol: 3,
        route: "",
      },
    ]
  })
};
</script>

<style>
  @import "../styles/components/dashboard.css";
</style>