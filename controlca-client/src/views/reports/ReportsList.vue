<template>
    <v-row align="center" class="list px-3 mt-2 mx-auto">
    <v-col cols="12" sm="12" v-if="currentUser.rol_id == 1">
      <v-card class="mx-auto p-3" tile>
        <v-card-title> <span class="primary--text">Reportes de proyectos</span>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="origin_projects"
          :hide-default-footer="false"
          :items-per-page="5"
          :search="search"
        >
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn @click="goReports(item.id)" x-small class="btn simple-btn xs">ver</v-btn>
            <!-- <v-icon small @click="openInfo(item.id)" class="mr-2 primary--text">mdi-folder-search</v-icon> -->
        </template>
        </v-data-table>

      </v-card>
    </v-col>
    <v-col cols="12" sm="12" v-else>
      <v-card class="mx-auto p-3" tile>
        <v-card-title> <span class="primary--text">Reportes de proyectos</span>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="currentUserNew.working_projects"
          :hide-default-footer="false"
          :items-per-page="5"
          :search="search"
        >
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn @click="goReports(item.id)" x-small class="btn simple-btn xs">ver</v-btn>
            <!-- <v-icon small @click="openInfo(item.id)" class="mr-2 primary--text">mdi-folder-search</v-icon> -->
        </template>
        </v-data-table>

      </v-card>
    </v-col>
    </v-row>
</template>

<script>
import UserDataService from "../../services/UserDataService";
import ProjectUserDataService from "../../services/ProjectUserDataService";
import ProjectDataService from "../../services/ProjectDataService";
export default {
  name: "reports-list",
  data() {
    return {
      origin_users: [],
      origin_project_users: [],
      origin_projects: [],
      projectsByLeader: [],
      currentUserNew: null,
      title: "",
      search: "",
      headers: [
        { text: "Código", align: "start", sortable: true, value: "code" },
        { text: "Nombre", value: "name", sortable: true },
        { text: "Nro. de áreas", value: "areas", sortable: true },
        { text: "Estatus", value: "status", sortable: true },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
  },
  methods: {
    goRoute(route) {
      this.$router.push("/" + route);
    },
    goReports(id) {
      this.$router.push("/reports/" + id);
    },
    retrieveUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.origin_users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveProjectUsers() {
      ProjectUserDataService.getAll()
        .then((response) => {
          this.origin_project_users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveProjects() {
      ProjectDataService.getAll()
        .then((response) => {
          this.origin_projects = response.data;
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
        console.log(this.projectsByLeader);
    },
    getUser(id) {
      UserDataService.get(id)
        .then((response) => {
          this.currentUserNew = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    
  },
  mounted() {
    this.retrieveUsers();
    this.retrieveProjectUsers();
    this.retrieveProjects();
    this.retrieveProjectsByLeader();
    this.getUser(this.currentUser.id);
  },
};
</script>

<style>

</style>