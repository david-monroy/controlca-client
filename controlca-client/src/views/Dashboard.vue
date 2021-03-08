<template>
  <div id="dashboard">
    <v-card
    class="mx-auto main-card"
    >
      <v-card-text>
        <div
          v-for="item in dashItems"
          :key="item.id"
          class="ma-2"
        >
               <DashboardCard
                :name="item.name"
                :route="item.route"
                class="text-center py-4"
              >
              </DashboardCard>
        </div>
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
  data: () => ({
    dashItems: [
      {
        id: 1,
        name: "myProfile",
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
</style>