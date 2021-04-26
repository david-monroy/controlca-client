<template>
  <div id="dashboard-po">
    <v-card
    class="mx-auto dashboard-po-main-card"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" class="dashboard-po-item-list">
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
  name: "Project_Offer",
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
        name: "Proyectos",
        icon: "mdi-tools",
        rol: 2,
        route: "projects",
      },
      {
        id: 2,
        name: "Ofertas",
        icon: "mdi-file-multiple",
        rol: 2,
        route: "offers",
      }
    ]
  })
};
</script>

<style>
  @import "../styles/components/dashboard.css";
</style>