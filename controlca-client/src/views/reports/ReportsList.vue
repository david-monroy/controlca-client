<template>
  <div>
    <div style="display: flex; justify-content: center">
      <v-btn
                color="primary" class="mr-3"
                @click="type='Proyectos'"
                >
                Proyectos
                </v-btn>
                <v-btn
                color="primary" class="ml-3"
                @click="type='Ofertas'"
                >
                Ofertas
                </v-btn>
    </div>
    <v-row align="center" class="list px-3 mt-2 mx-auto" v-if="type=='Proyectos'">
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
        <div v-if="origin_projects.length < 1">
          <p>No hay ningún proyecto registrado en el sistema.</p>
        </div>
        <v-data-table
          :headers="project_headers"
          :items="origin_projects"
          :hide-default-footer="false"
          :items-per-page="5"
          :search="search"
          v-else
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
        <div v-if="currentUserNew.working_projects.length < 1">
          <p>No estás involucrado a ningún proyecto.</p>
        </div>
        <v-data-table
          :headers="project_headers"
          :items="currentUserNew.working_projects"
          :hide-default-footer="false"
          :items-per-page="5"
          :search="search"
          v-else
        >
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn @click="goReports(item.id)" x-small class="btn simple-btn xs">ver</v-btn>
            <!-- <v-icon small @click="openInfo(item.id)" class="mr-2 primary--text">mdi-folder-search</v-icon> -->
        </template>
        </v-data-table>

      </v-card>
    </v-col>
    </v-row>

    <v-row align="center" class="list px-3 mt-2 mx-auto" v-else>
    <v-col cols="12" sm="12" v-if="currentUser.rol_id == 1">
      <v-card class="mx-auto p-3" tile>
        <v-card-title> <span class="primary--text">Reportes de ofertas</span>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <div v-if="origin_projects.length < 1">
          <p>No hay ninguna oferta registrada en el sistema.</p>
        </div>
        <v-data-table
          :headers="offer_headers"
          :items="origin_offers"
          :hide-default-footer="false"
          :items-per-page="5"
          :search="search"
          v-else
        >
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn @click="goOfferReports(item.id)" x-small class="btn simple-btn xs">ver</v-btn>
            <!-- <v-icon small @click="openInfo(item.id)" class="mr-2 primary--text">mdi-folder-search</v-icon> -->
        </template>
        </v-data-table>

      </v-card>
    </v-col>
    <v-col cols="12" sm="12" v-else>
      <v-card class="mx-auto p-3" tile>
        <v-card-title> <span class="primary--text">Reportes de ofertas</span>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <div v-if="currentUserNew.working_offers.length < 1">
          <p>No estás involucrado a ninguna oferta.</p>
        </div>
        <v-data-table
          :headers="offer_headers"
          :items="currentUserNew.working_offers"
          :hide-default-footer="false"
          :items-per-page="5"
          :search="search"
          v-else
        >
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn @click="goOfferReports(item.id)" x-small class="btn simple-btn xs">ver</v-btn>
            <!-- <v-icon small @click="openInfo(item.id)" class="mr-2 primary--text">mdi-folder-search</v-icon> -->
        </template>
        </v-data-table>

      </v-card>
    </v-col>
    </v-row>
  </div>
    
</template>

<script>
import UserDataService from "../../services/UserDataService";
import ProjectUserDataService from "../../services/ProjectUserDataService";
import ProjectDataService from "../../services/ProjectDataService";
import OfferUserDataService from "../../services/OfferUserDataService";
import OfferDataService from "../../services/OfferDataService";
export default {
  name: "reports-list",
  data() {
    return {
      origin_users: [],
      origin_project_users: [],
      origin_projects: [],
      origin_offer_users: [],
      origin_offers: [],
      projectsByLeader: [],
      offersByLeader: [],
      currentUserNew: null,
      title: "",
      search: "",
      type: "Proyectos",
      project_headers: [
        { text: "Código", align: "start", sortable: true, value: "code" },
        { text: "Nombre", value: "name", sortable: true },
        { text: "Nro. de áreas", value: "areas", sortable: true },
        { text: "Estatus", value: "status", sortable: true },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      offer_headers: [
        { text: "Código", align: "start", sortable: true, value: "code" },
        { text: "Nombre", value: "name", sortable: true },
        { text: "Departamento", value: "department", sortable: true },
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
    goOfferReports(id) {
      this.$router.push("/offer_reports/" + id);
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
    retrieveOfferUsers() {
      OfferUserDataService.getAll()
        .then((response) => {
          this.origin_offer_users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveOffers() {
      OfferDataService.getAll()
        .then((response) => {
          this.origin_offers = response.data;
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
    retrieveOffersByLeader() {
      OfferDataService.getByLeader(this.currentUser.id)
        .then((response) => {
          this.offersByLeader = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
        console.log(this.offersByLeader);
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
    this.retrieveOfferUsers();
    this.retrieveOffers();
    this.retrieveOffersByLeader();
    this.getUser(this.currentUser.id);
  },
};
</script>

<style>

</style>