<template>
  <div id="projects">
    <v-card
    class="mx-auto main-card-projects"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" class="item-list-projects">
            <div
              v-for="item in projects"
              :key="item.id"
            >
              <ProjectCard
                :name="item.name"
                :description="item.description"
                :code="item.code"
                :area="item.area"
                :status="item.status"
                :products="item.products"
                :users="item.working_users"
                :leader="item.leader"
              >
              </ProjectCard>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn class="simple-btn mt-2 mx-auto" @click="goRoute(addProject)">
          Registrar Proyecto
        </v-btn>
      </v-card-actions>
      
    </v-card>
  </div>
</template>

<script>
import ProjectCard from "../../components/projects/ProjectCard.vue";
import ProjectDataService from "../../services/ProjectDataService";
export default {
  name: "projectsList",
  components: {
    ProjectCard
  },
  data: () => ({
    projects: [],
    addProject: 'projects-add',
  }),
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
  },
  methods: {
    retrieveProjects() {
      ProjectDataService.getAll()
        .then((response) => {
          this.projects = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    goRoute(route) {
      this.$router.push("/" + route);
    },
  },
  mounted() {
    this.retrieveProjects();
  },
  
};
</script>

<style>
.main-card-projects{
    width: 100%;
    padding: 30px;
  }
  .item-list-projects{
    display: flex;
    justify-content: space-around;
    min-height: 450px;
    padding: 0 40px;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>