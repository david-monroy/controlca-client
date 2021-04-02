<template>
  <div id="projects">
    <v-card
    class="mx-auto main-card-projects"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" class="item-list-projects"
          v-if="currentUser.id == 1">
            <v-card v-if="projects.length < 1" class="mx-auto">
              <v-card-text>
                <h5>No hay proyectos registrados en el sistema.</h5>
              </v-card-text>
            </v-card>
            <div
              v-for="item in projects"
              :key="item.id"
            >
              <ProjectCard
                :name="item.name"
                :description="item.description"
                :code="item.code"
                :areas="item.areas"
                :status="item.status"
                :products="item.products"
                :users="item.working_users"
                :leader="item.leader"
                :id="item.id"
              >
              </ProjectCard>
            </div>
          </v-col>
          <v-col cols="12" class="item-list-projects"
          v-else>
            <v-card v-if="projectsByLeader.length < 1" class="mx-auto">
              <v-card-text>
                <h5>No hay proyectos registrados por usted en el sistema.</h5>
              </v-card-text>
            </v-card>
            <div
              v-for="item in projectsByLeader"
              :key="item.id"
            >
              <ProjectCard
                :name="item.name"
                :description="item.description"
                :code="item.code"
                :areas="item.areas"
                :status="item.status"
                :products="item.products"
                :users="item.working_users"
                :leader="item.leader"
                :id="item.id"
              >
              </ProjectCard>
            </div>

          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn class="simple-btn mt-2 mx-auto w-50" @click="goRoute(addProject)">
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
  name: "projects",
  components: {
    ProjectCard
  },
  data: () => ({
    projects: [],
    addProject: 'projects-add',
    projectsByLeader: [],
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
    retrieveProjectsByLeader() {
      ProjectDataService.getByLeader(this.currentUser.id)
        .then((response) => {
          this.projectsByLeader = response.data;
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
    this.retrieveProjectsByLeader();
    console.log(this.projects)
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
    justify-content: flex-start;
    min-height: 450px;
    padding: 0 20px;
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }

</style>