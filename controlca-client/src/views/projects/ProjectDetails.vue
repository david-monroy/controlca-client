<template>
  <div class="col-md-12 mt-3 pt-1">
      <h3 class="text-center mb-2">Editar proyecto</h3>
    <v-stepper v-model="formStep" class="mt-0 form-card stepper-project mx-auto">
    <v-stepper-header>
      <v-stepper-step
        :complete="formStep > 1"
        step="1"
      >
        Datos generales
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-row class="pb-0 mb-0 pt-2 form-row" >
            <v-col md="12" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="projectData.name"
                        
                        label="Nombre"
                        required
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>
          <input type="hidden" value="currentUser.id">
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="projectData.code"
                        label="Código"
                        name="code"
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="projectData.area"
                        name="area"
                        label="Área de trabajo"
                        required
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="12" cols="12" class="py-0">
                <div class="form-group">
                    <v-textarea
                        v-model="projectData.description"
                        filled height="100"
                        label="Descripción"
                        required
                    ></v-textarea>
                </div>
            </v-col>
          </v-row>

        <div style="display: flex; justify-content: space-between">
            <v-btn text @click="goRoute('projects')">
                Cancelar
            </v-btn>
            <v-btn
                color="primary"
                @click="saveProject()"
                >
                Guardar Cambios
                </v-btn>
        </div>
        
      </v-stepper-content>

      
    </v-stepper-items>
  </v-stepper>
    </div>

</template>

<script>

import ProjectDataService from "../../services/ProjectDataService";
export default {
  name: "project-details",
  data: () => ({
      formStep: 1,
      projectData: [],
      
  }),
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
  },
  methods: {
      
    getProject(id) {
      ProjectDataService.get(id)
        .then((response) => {
          this.projectData = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    
    async saveProject() {
      var data = {
        name: this.projectData.name,
        description: this.projectData.description,
        code: this.projectData.code,
        area: this.projectData.area,
        leader: this.currentUser.id,
      };
      ProjectDataService.update(this.projectData.id, data)
      .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });

        this.goRoute("projects");

    },
    goRoute(route) {
      this.$router.push("/" + route);
    },
  },
  mounted() {
      this.getProject(this.$route.params.id);
  }
}
</script>

<style>
    .stepper-project{
        width: 60%;
    }
    .add-product-section{
        border: 1px solid lightgray;
        border-radius: 20px;
        padding-top: 10px;
        margin-bottom: 10px;
    }
    .project-confirm-section{
        border: 1px solid lightgray;
        border-radius: 10px;
        padding: 8px;
    }
</style>