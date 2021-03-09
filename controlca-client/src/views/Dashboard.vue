<template>
  <div id="dashboard">
    <v-card
    class="mx-auto main-card"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" class="item-list">
            <div
              v-for="item in dashItems"
              :key="item.id"
            >
              <DashboardCard
                :name="item.name"
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
        name: "Proyectos",
        img: "",
        route: "projects",
      },
      {
        id: 2,
        name: "Usuarios",
        img: "",
        route: "users",
      },
      {
        id: 3,
        name: "Cargar Horas",
        img: "",
        route: "",
      },
      {
        id: 4,
        name: "Reportes",
        img: "",
        route: "",
      },
    ]
  })
};
</script>

<style>
  #dashboard{
    display: flex;
    align-items: center;
    min-height: 540px;
  }
  .main-card{
    width: 60%;
    padding: 30px;
  }
  .item-list{
    display: flex;
    justify-content: space-around;
    height: 450px;
    padding: 0 40px;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>