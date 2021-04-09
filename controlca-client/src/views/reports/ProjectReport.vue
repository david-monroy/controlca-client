<template>
    <v-row align="center" class="list px-3 mt-2 mx-auto">
    <v-col cols="12" sm="12">
      <v-card class="mx-auto p-3" tile>
        <h4 class="primary--text text-center">{{projectData.name}} - {{projectData.code}}
        </h4>
        <div class="report-main">
            <div class="report-indicators">
                <div class="report-item">
                    <h6 class="text-center ma-0">Horas trabajadas/estimadas:</h6>
                    <p class="my-2">{{total_worked_hours}}/{{total_estimated_hours}}</p>
                    <v-progress-circular 
                        :value="worked_hours_percent"
                        :size="70"
                        :width="7"
                        color="primary"
                        class="report-progress mt-0">
                        {{worked_hours_percent}}%
                    </v-progress-circular>
                    
                </div>
                <div class="report-item mt-2">
                  <div class="display: flex; justify-content: center">
                    <h6 class="text-center ma-0" style="display: inline">Avance del proyecto:</h6>
                    <v-tooltip
                      v-model="show"
                      right 
                      style="display: inline"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          x-small
                          class="pl-2 pb-1"
                        >
                          <v-icon color="grey lighten-1">
                            mdi-information
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>En función a <br>los productos <br> completados.</span>
                    </v-tooltip>
                  </div>
                    
                    <v-progress-circular 
                        :value="project_advance"
                        :size="70"
                        :width="7"
                        color="primary"
                        class="report-progress mt-0">
                        {{project_advance}}%
                    </v-progress-circular>
                    <v-btn @click="productsDialog = true" x-small class="btn simple-btn mt-2">ver productos</v-btn>
                </div>
                <div class="report-item mt-2">
                  <div class="display: flex; justify-content: center">
                    <h6 class="text-center ma-0" style="display: inline">Usuarios en el proyecto:</h6>
                    <v-tooltip
                      v-model="show2"
                      right 
                      style="display: inline"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          x-small
                          class="pl-2 pb-1"
                        >
                          <v-icon color="grey lighten-1">
                            mdi-information
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>En función a <br>las horas en <br> total trabajadas.</span>
                    </v-tooltip>
                  </div>
                      <div v-for="item in users_worked_hours" :key="item.id" class="item-user">
                        <p class="ma-0 text-center w-100 mb-1">{{item.name}} {{item.lastname}} <span class="secondary--text">- {{item.project_user.roster}}</span> </p>
                        <v-progress-linear
                          v-model="item.load_hours_percent"
                          color="primary"
                          height="10"
                          width="100"
                          rounded
                          class="w-100"
                        >
                            <strong style="font-size: 11px">{{ item.load_hours }} horas</strong>
                        </v-progress-linear>
                      </div>
                </div>
            </div>
            <div class="report-bitacora pa-4">
              <Bitacora
                :project="projectData"
                :project_users="users_worked_hours"
              ></Bitacora>
            </div>
        </div>
        <template>
              <v-dialog v-model="productsDialog" max-width="600px">
                <v-card class="pa-6 pb-2">
                  <p class="mb-2" style="color: gray; font-size: 14px">* Sólo el líder puede actualizar esta información.</p>
                    <v-simple-table
                        fixed-header
                        height="300px"
                    >
                        <thead>
                            <tr>
                            <th class="text-left">
                                Área
                            </th>
                            <th class="text-left">
                                Código
                            </th>
                            <th class="text-left">
                                Nombre
                            </th>
                            <th class="text-center">
                                Completado
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="item in area_products"
                            :key="item.name"
                            >
                                <td>{{ item.area_name }}</td>
                                <td>{{ item.code }}</td>
                                <td>{{ item.name }}</td>
                                <td v-if="currentUser.id == projectData.leader_id" class="text-center">
                                    <v-simple-checkbox
                                    v-model="item.area_product.completed"
                                    ></v-simple-checkbox>
                                </td>
                                <td v-else class="text-center">
                                    <v-simple-checkbox
                                    disabled
                                    v-model="item.area_product.completed"
                                    ></v-simple-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                    <div style="display: flex; justify-content: center">
                        <v-btn @click="saveChanges()" class="btn simple-btn mb-4 mx-auto">guardar cambios</v-btn>
                    </div>
                </v-card>
              </v-dialog>
          </template>
      </v-card>
    </v-col>
    </v-row>
</template>

<script>
import UserDataService from "../../services/UserDataService";
import ProjectUserDataService from "../../services/ProjectUserDataService";
import ProjectDataService from "../../services/ProjectDataService";
import AreaDataService from "../../services/AreaDataService";
import Bitacora from "../../components/reports/Bitacora.vue";
export default {
  name: "project-report",
  components: {
    Bitacora,
  },
  data() {
    return {
      origin_users: [],
      origin_project_users: [],
      origin_areas: [],
      projectData: null,
      productsDialog: false,
      show: false,
      show2: false,
    }
  },
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
    project_areas(){
        let areas = [];
        let project_id = this.currentProjectId;
        this.origin_projects.forEach(project => {
            if (project_id == project.id){
                 project.project_areas.forEach(area => {
                    areas.push(area);
                 });      
            }            
        });
        return areas;
    },
    area_products(){
        let products = [];
        // let project_id = this.currentProjectId;
        this.origin_areas.forEach(area => {
            if (area.project_id == this.projectData.id){
                 area.products.forEach(prod => {
                  prod.area_name = area.name;
                  products.push(prod);
                 });      
            }            
        });
        return products;
    },
    total_estimated_hours(){
        let hours = 0;
        this.area_products.forEach(prod => {
            hours += prod.area_product.estimated_hours;
        });
        return hours;
    },
    total_worked_hours(){
      let hours = 0;
      this.origin_project_users.forEach(pu => {
        if (this.projectData.id == pu.project_id){
          pu.loads.forEach(load => {
            hours = hours + load.hours;
          });
        }
      });
      return hours;
    },
    worked_hours_percent(){
        let percent = (this.total_worked_hours * 100)/this.total_estimated_hours;
        return percent.toFixed(1);
    },
    project_advance(){
        let completed = 0;
        let total = 0;
        this.area_products.forEach(prod => {
            if (prod.area_product.completed){
                completed += 1;
            }
            total += 1;
        });
        let percent = (completed * 100)/total;
        return percent.toFixed(1);
    },
    users_worked_hours(){
      let users = [];
      let load_hours;
      this.projectData.working_users.forEach(worker => {
        load_hours = 0;
        this.origin_project_users.forEach(pu => {
          if (pu.project_id == this.projectData.id) {
            if (worker.id == pu.worker_id) {
            pu.loads.forEach(load => {
              load_hours += load.hours;
            });
          }
          }
          
        });
        worker.load_hours = load_hours;
        worker.load_hours_percent = ((load_hours*100)/this.total_worked_hours).toFixed(1);
        users.push(worker)
      });
      return users;
    }
  },
  methods: {
    goRoute(route) {
      this.$router.push("/" + route);
    },
    goReports(id) {
      this.$router.push("/reports/" + id);
    },
    saveChanges(){
        this.area_products.forEach(product => {
            var data = {
                completed: product.area_product.completed
            };
            AreaDataService.updateProduct(product.area_product.id, data)
            .then((response) => {
                console.log(response.data);
                })
                .catch((e) => {
                console.log(e);
                });
        });
        this.productsDialog = false;
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
    retrieveAreas() {
      AreaDataService.getAll()
        .then((response) => {
          this.origin_areas = response.data;
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
  },
  mounted() {
    this.retrieveUsers();
    this.retrieveAreas();
    this.retrieveProjectUsers();
    this.getProject(this.$route.params.id);
  },
};
</script>

<style>
    .report-main{
        display: flex;
    }
    .report-indicators{
        flex: 1;
        background-color: #ecebe5a4;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border-radius: 8px;
    }
    .report-bitacora{
        flex: 2;
    }
    .report-item{
        border: solid 1px #636060;
        padding: 10px;
        border-radius: 6px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .item-user{
      background-color: #d6d5cea4;
      margin-top: 10px;
      width: 80%;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 14px;
    }
</style>