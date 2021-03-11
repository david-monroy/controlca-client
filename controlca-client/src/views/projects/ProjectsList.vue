<template>
  <div id="projects">
    <v-card
    class="mx-auto main-card"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" class="item-list">
            <div
              v-for="item in projects"
              :key="item.id"
            >
              {{item.name}}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// import DashboardCard from "../../components/dashboard/DashboardCard.vue";
export default {
  name: "projectsList",
  components: {
    // DashboardCard
  },
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
  },
  data: () => ({
      projects: [
          {
              name: "Proyecto",
              description: "Descripción",
              area: "Area",
              code: "Código"
          }
      ]
  })
};
</script>

<style>

</style>