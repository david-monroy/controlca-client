<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col cols="12" md="8">
      <v-text-field v-model="title" label="Search by Title"></v-text-field>
    </v-col>

    <v-col cols="12" md="4">
      <v-btn small @click="searchTitle">
        Search
      </v-btn>
    </v-col>

    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Proyectos</v-card-title>

        <v-data-table
          :headers="headers"
          :items="projects"
          disable-pagination
          :hide-default-footer="true"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editTutorial(item.id)">mdi-pencil</v-icon>
            <v-icon small @click="deleteTutorial(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>

        <v-card-actions v-if="projects.length > 0">
          <v-btn small color="error" @click="removeAllProjectos">
            Remove All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ProjectDataService from "../../services/ProjectDataService";
export default {
  name: "projects-list",
  data() {
    return {
      projects: [],
      title: "",
      headers: [
        { text: "Nombre", align: "start", sortable: false, value: "name" },
        { text: "Descripción", value: "description", sortable: false }
      ],
    };
  },
  methods: {
    retrieveProjectss() {
      ProjectDataService.getAll()
        .then((response) => {
          this.projects = response.data.map(this.getDisplayProject);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveProjects();
    },

    removeAllProjects() {
      ProjectDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      ProjectDataService.findByTitle(this.title)
        .then((response) => {
          this.projects = response.data.map(this.getDisplayProject);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editProject(id) {
      this.$router.push({ name: "projects-details", params: { id: id } });
    },

    deleteProject(id) {
      ProjectDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayProject(project) {
      return {
        id: project.id,
        title: project.title.length > 30 ? project.title.substr(0, 30) + "..." : project.title,
        description: project.description.length > 30 ? project.description.substr(0, 30) + "..." : project.description
      };
    },
  },
  mounted() {
    this.retrieveProjects();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>