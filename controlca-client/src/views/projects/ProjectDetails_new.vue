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
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="projectData.name"
                        
                        label="Nombre"
                        required
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <v-select
                    v-model="projectData.status"
                    :items="status_list"
                    label="Estatus"
                    dense
                    required
                    style="margin-top: 22px"
                ></v-select>
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
                        v-mask="'####'"
                        type="number"
                        readonly
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
                        label="Descripción (opcional)"
                        
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
                Guardar cambios
                </v-btn>
        </div>
        
      </v-stepper-content>
      
    </v-stepper-items>
  </v-stepper>
  <v-snackbar
          v-model="alertError"
          type="error"
          top
          :timeout="timeout"
          color="error"
        >
          <strong class="body-1 font-weight-bold">
            {{errorMessage}}
          </strong>
          <template v-slot:action="{ attrs }">
            <v-btn
              dark
              icon
              color="white"
              v-bind="attrs"
              @click="alertError = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
    </v-snackbar>
    <v-dialog v-model="confirmWorkers" max-width="500px">
            <v-card style="display: flex; justify-content: center; flex-direction: column">
                  <v-card-title class="body-1 text-center mx-auto">¿Seguro que no desea añadir <br> más involucrados además del líder?</v-card-title>
            <v-card-actions style="display: flex; justify-content: space-between">
                <v-spacer></v-spacer>
                <v-btn class="simple-btn-back" text @click="confirmWorkers = false">Regresar</v-btn>
                <v-btn class="simple-btn" text @click="formStep = 4; confirmWorkers = false">Sí, continuar</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        </v-dialog>
        <v-dialog v-model="confirmCancel" max-width="500px">
        <v-card style="display: flex; justify-content: center; flex-direction: column">
                  <v-card-title class="body-1 text-center mx-auto">¿Seguro que desea cancelar y salir?</v-card-title>
            <v-card-actions style="display: flex; justify-content: space-between">
                <v-spacer></v-spacer>
                <v-btn class="simple-btn-back" text @click="confirmCancel = false">No, seguir registrado</v-btn>
                <v-btn class="simple-btn" text @click="goRoute('projects')">Sí, salir</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>

</template>

<script>

import ProjectDataService from "../../services/ProjectDataService";
import AreaDataService from "../../services/AreaDataService";
import UserDataService from "../../services/UserDataService";
import ProjectUserDataService from "../../services/ProjectUserDataService";
import ProductDataService from "../../services/ProductDataService";
export default {
  name: "project-details",
  data: () => ({
      formStep: 1,
      projectData: {
        working_users: [],
      },
      origin_areas: [],
      origin_projects: [],
      origin_products: [],
      origin_project_code: null,

      origin_project_users: [],

      origin_workers: [],
      temp_worker_id: null,
      temp_worker_roster: null,

      project_products: [],
      project_workers: [],

      workers_to_delete: [],

      roster_list: [
          "Director",
          "Gerente",
        //   "Líder",
          "Colaborador"
      ], 

      status_list: [
          "En proceso",
          "Entregado",
          "Detenido",
          "Culminado"
      ], 

      temp_product_id: null,
      temp_product_name: null,
      temp_product_area: null,
      temp_product_estimated_hours: null,
      temp_product_obs: null,

      temp_area_id: null,
      temp_area_name: null,

      confirmWorkers: false,
      confirmCancel: false,

      timeout: 4000,
      alertError: false,
      errorMessage: null,
  }),
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
    
    areas_list(){
        let n = this.projectData.areas;
        let list = [];
        for (let i = 1; i <= n; i++){
            if (i<10) list.push("A0" + i);
            else list.push("A" + i);
        }
        return list;
    },
    origin_workers_admin() {
        let data = [];
        this.origin_workers.forEach(worker => {
            if (worker.rol.name == "Administrador") {
                data.push(worker);
            }
            worker.completeName = worker.name + " " + worker.lastname;
        });
        return data;
    },
    origin_workers_projects() {
        let data = [];
        this.origin_workers.forEach(worker => {
            if (worker.rol.name == "Administrador" || worker.rol.name =="Proyectos") {
                data.push(worker);
            }
            worker.completeName = worker.name + " " + worker.lastname;
        });
        return data;
    },
    origin_workers_hours() {
        let data = [];
        this.origin_workers.forEach(worker => {
            data.push(worker);
            worker.completeName = worker.name + " " + worker.lastname;
        });
        return data;
    },

  },
  methods: {

    set_project_products(){
      let products = [];
      this.origin_areas.forEach(area => {
        if (area.project_id == this.projectData.id){
          area.products.forEach(p => {
            p.area_name = area.name;
            p.estimated_hours = p.area_product.estimated_hours;
            products.push(p);
          });  
        }
      });
      this.project_products = products;
    },
    set_project_workers(){
      let workers = [];
        this.projectData.working_users.forEach(worker => {
            worker.roster = worker.project_user.roster;
            worker.toAdd = true;
            workers.push(worker);
        });
      this.project_workers = workers;
    },

    codeIsCorrect(){
          if (this.projectData.code > 6999 && this.projectData.code < 8000) 
              return true;
          if (this.projectData.code > 3999 && this.projectData.code < 5000) 
              return true;
          return false;
    },
    validateStep1(){
          if (!this.projectData.name){
              this.errorMessage = "Debes indicar el nombre del proyecto."
              this.alertError = true;
          } else if (!this.projectData.code) {
              this.errorMessage = "Debes indicar el código del proyecto."
              this.alertError = true;
          } else if (!this.projectData.areas || this.projectData.areas<1) {
              this.errorMessage = "Al menos debe tener un (1) área de trabajo."
              this.alertError = true;
          } else if (!this.codeIsCorrect()) {
              this.errorMessage = "Verifique que el código inicie con 4 o 7, y que tenga cuatro (4) dígitos"
              this.alertError = true;
          } else {
                  this.set_project_products();
                  this.formStep = 2;
          }
      },
      validateStep2(){
          let check;
          let checked = 0;

          this.areas_list.forEach(area => {
              check = false;
              this.project_products.forEach(product => {
                  if (product.area_name == area) check = true
              });
              if (check) checked += 1;
          });


          if (checked < this.areas_list.length) {
              this.errorMessage = "Debes añadir al menos un (1) producto a cada área.";
              this.alertError = true;
          } else {
            this.set_project_workers();
            this.formStep = 3;
          }
      },
      validateStep3(){
          if (this.project_workers.length < 2){
              this.confirmWorkers = true;
          } else this.formStep = 4;
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
    addProductToProject(){
        let product_name = "";
        let product_code = "";
        if (!this.temp_product_id){
            this.errorMessage = "Debes indicar el producto."
            this.alertError = true;
        } else if (!this.temp_product_estimated_hours){
            this.errorMessage = "Debes indicar las horas estimadas."
            this.alertError = true;
        } else if (!this.temp_product_area){
            this.errorMessage = "Debes indicar el área de trabajo."
            this.alertError = true;
        } else {

                this.origin_products.forEach(op => {
                    if (op.id==this.temp_product_id) {
                        product_name = op.name;
                        product_code = op.code;
                    } 
                });
                this.project_products.push({
                    id: this.temp_product_id, 
                    estimated_hours: this.temp_product_estimated_hours,
                    name: product_name,
                    code: product_code,
                    area_name: this.temp_product_area,
                });
                this.temp_product_id = "",
                this.temp_product_estimated_hours = "",
                this.temp_product_area = ""

        }
    },
    removeProduct(pos){
        return this.project_products.splice(pos, 1);
    },
    addWorkerToProject(){
        let worker_name = "";
        let worker_lastname = "";
        let itExists = false;
        if (!this.temp_worker_roster){
            this.errorMessage = "Debes indicar el rol del involucrado."
            this.alertError = true;
        } else if (!this.temp_worker_id){
            this.errorMessage = "Debes indicar el involucrado a añadir."
            this.alertError = true;
        } else {
            this.project_workers.forEach(worker => {
                if (worker.id == this.temp_worker_id) itExists = true;
            });
            if (!itExists) {
                this.origin_workers.forEach(op => {
                    if (op.id==this.temp_worker_id) {
                        worker_name = op.name;
                        worker_lastname = op.lastname;
                    } 
                });
                this.project_workers.push({
                    id: this.temp_worker_id, 
                    roster: this.temp_worker_roster,
                    name: worker_name,
                    lastname: worker_lastname,
                });
            } else {
               this.errorMessage = "Ya está agregado."
               this.alertError = true;
            }
        }
    },
    removeWorker(pos, worker_id){
        this.workers_to_delete.push(worker_id);
        return this.project_workers.splice(pos, 1);
    },
    retrieveUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.origin_workers = response.data;
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
    
    async saveProject() {
      var data = {
        name: this.projectData.name,
        description: this.projectData.description,
        areas: this.projectData.areas,
        status: this.projectData.status
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
    retrieveAreas() {
      AreaDataService.getAll()
        .then((response) => {
          this.origin_areas = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveProducts() {
      ProductDataService.getAll()
        .then((response) => {
          this.origin_products = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
      this.getProject(this.$route.params.id);
      this.retrieveAreas();
      this.retrieveProjects();
      this.retrieveUsers();
      this.retrieveProjectUsers();
      this.retrieveProducts();
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