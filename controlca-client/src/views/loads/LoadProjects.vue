<template>
  <v-row align="center" class="load-list px-3 mt-2 mx-auto">
    <v-col cols="12" sm="12">
      <v-card class="mx-auto p-3" tile>
        <v-card-title> <span class="primary--text">Cargar horas en proyecto</span>
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
          :items="user_projects"
          :hide-default-footer="false"
          :items-per-page="5"
          :search="search"
        >

        <template v-slot:top>
              <v-dialog v-model="loadDialog" max-width="500px">
                <v-card class="pa-10 pb-2">
                    <div class="mx-auto pb-2">
                        <p class="primary--text text-center">Cargar horas - {{currentProjectName}} - {{currentProjectCode}}</p>
                    </div>
                    <div>
                        <v-row class="pb-0 mb-0 form-row" >
                            <v-col md="6" cols="12" class="py-0">
                            <v-select
                                v-model="payload.area_id"
                                :items="project_areas"
                                label="Área"
                                item-text="name"
                                item-value="id"
                                dense
                                required
                            ></v-select>
                            </v-col>
                            <v-col md="6" cols="12" class="py-0">
                            <v-select
                                v-model="payload.product_id"
                                :items="area_products"
                                label="Producto"
                                item-text="name"
                                item-value="id"
                                dense
                                required
                            ></v-select>
                            </v-col>
                        </v-row>
                        <v-row class="pb-0 mb-0 form-row" >
                            <v-col md="6" cols="12" class="py-0">
                                <v-menu
                                ref="menu1"
                                v-model="menu1"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="auto"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    v-model="dateFormatted"
                                    label="Fecha"
                                    hint="MM/DD/AAAA"
                                    persistent-hint
                                    prepend-icon="mdi-calendar"
                                    v-bind="attrs"
                                    @blur="date = parseDate(dateFormatted)"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="date"
                                    no-title
                                    @input="menu1 = false"
                                ></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col md="6" cols="12" class="py-0">
                                <v-text-field
                                    v-model="payload.hours"
                                    label="Horas"
                                    name="hours"
                                    type="number"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="pb-0 mb-0 form-row" >
                <v-col md="12" cols="12" class="py-0">
                    <div class="form-group">
                        <v-textarea
                            v-model="payload.observations"
                            filled height="100"
                            label="Observaciones (opcional)"
                            required
                        ></v-textarea>
                    </div>
                </v-col>
            </v-row>
                    </div>
                    
                    
                    <v-btn class="simple-btn mt-2 mx-auto btn-block w-75" @click="saveHours()">
                        Cargar horas
                    </v-btn>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="secondary--text" text @click="historyDialog = false">Cancelar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="historyDialog" max-width="700px">
                <v-card class="pa-10 pb-2">
                    <div class="mx-auto pb-2">
                        <p class="primary--text text-center">Historial en {{currentProjectName}} - {{currentProjectCode}}</p>
                    </div>
                    <div v-if="history_loads.length == 0">
                      <p>Aún no has cargado horas a este proyecto.</p>
                    </div>
                    <v-simple-table v-else
                        fixed-header
                        height="300px"
                    >
                        <thead>
                            <tr>
                            <th class="text-center">
                                Fecha
                            </th>
                            <th class="text-center">
                                Horas
                            </th>
                            <th class="text-center">
                                Producto
                            </th>
                            <th class="text-center">
                                Observaciones
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="item in history_loads"
                            :key="item.id"
                            >
                                <td class="text-center">{{ item.date }}</td>
                                <td class="text-center">{{ item.hours }}</td>
                                <td class="text-center">{{ item.product_name }}</td>
                                <td v-if="item.observations != null" class="text-center">{{ item.observations }}</td>
                                <td v-else class="text-center">-</td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="secondary--text" text @click="historyDialog = false">cerrar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip
                top 
                style="display: inline"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on"
                @click="openLoadDialog(item.id, item.name, item.code)" class="mr-2 primary--text text-center">mdi-plus-circle</v-icon>
              </template>
              <span>Cargar horas</span>
            </v-tooltip>
            
            <v-tooltip
                top 
                style="display: inline"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on"
                @click="openHistoryDialog(item.id, item.name, item.code)" class="mr-2 text-center">mdi-history</v-icon>
              </template>
              <span>Historial</span>
            </v-tooltip>
  
          </template>
        </v-data-table>

      </v-card>
    </v-col>
    <div class="buttons">
      <v-btn class="btn-block w-25 mx-auto simple-btn-back" @click="goRoute(goBack)">
        Regresar
      </v-btn>
    </div>
    
    <v-snackbar
          v-model="alertSuccess"
          type="success"
          top
          :timeout="timeout"
          color="success"
        >
          <strong class="body-1 font-weight-bold">
            {{successMessage}}
          </strong>
          <template v-slot:action="{ attrs }">
            <v-btn
              dark
              icon
              color="white"
              v-bind="attrs"
              @click="alertSuccess = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
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
  </v-row>
</template>

<script>
import ProjectDataService from "../../services/ProjectDataService";
import ProjectUserDataService from "../../services/ProjectUserDataService";
import ProductDataService from "../../services/ProductDataService";
import UserDataService from "../../services/UserDataService";
import AreaDataService from "../../services/AreaDataService";
import LoadDataService from "../../services/LoadDataService";
export default {
  name: "load-projects",
  data() {
    return {
      origin_projects: [],
      origin_project_users: [],
      origin_products: [],
      origin_areas: [],
      origin_users: [],
      origin_loads: [],
      currentProjectId: "",
      currentProjectName: "",
      currentProjectCode: "",
      loadProjectHours: 'load-project-hours',
      goBack: "loads",
      title: "",
      search: "",
      headers: [
        { text: "Nombre", align: "start", sortable: true, value: "name" },
        { text: "Código", value: "code", sortable: true },
        { text: "Áreas", value: "areas", sortable: true },
        { text: "Rol", value: "project_user.roster", sortable: true },
        { text: "Horas trabajadas", value: "worked_hours", sortable: true },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      expanded: [],
      singleExpand: true,

      payload: {
          product_id: "",
      },

      loadDialog: false,
      historyDialog: false,

      // Snackbar
      timeout: 4000,
      alertSuccess: false,
      successMessage: "",

      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,

      alertError: false,
      errorMessage: "",
      actual_date: new Date(),
    };
  },
  computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    currentUser() {      
      return this.$store.state.auth.user;
    },
    user_projects(){
        let projects = [];
        let hours;
        this.origin_users.forEach(user => {
            user.working_projects.forEach(wp => {
              hours = 0;
              this.origin_project_users.forEach(pu => {
                if ((this.currentUser.id == pu.worker_id) && (wp.id == pu.project_id)){
                  pu.loads.forEach(load => {
                    hours = hours + load.hours;
                  });
                }
              });
                wp.worked_hours = hours;
                console.log(wp.worked_hours);
                projects.push(wp);
            });
            
        });
        return projects;
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
        return areas.reverse();
    },
    area_products(){
        let products = [];
        // let project_id = this.currentProjectId;
        this.origin_areas.forEach(area => {
            if (area.id == this.payload.area_id){
                 area.products.forEach(prod => {
                  products.push(prod);
                    
                 });      
            }            
        });
        return products;
    },
    project_user_id(){
      let pu_id = 0;
      this.origin_project_users.forEach(pu => {
        if ((this.currentUser.id == pu.worker_id) && (this.currentProjectId == pu.project_id)){
          pu_id = pu.id;
        }
      });
      return pu_id
    },
    history_loads(){
      let loads = [];
      this.origin_loads.forEach(load => {
          if (load.project_user.worker_id == this.currentUser.id && load.project_user.project_id == this.currentProjectId) {
            this.origin_products.forEach(op => {
              if (op.id == load.product_id) {
                load.product_name = op.name;
                loads.push(load);
              }
            });        
          }
      });
      return loads.reverse();
    }
  },

  methods: {

    saveHours(){
        
        let loadPayload = {
            project_user: this.project_user_id,
            date: this.dateFormatted,
            hours: this.payload.hours,
            observations: this.payload.observations,
            product: this.payload.product_id,
        }
        console.log(loadPayload);
        let f = (this.actual_date);
        console.log(f);
        var parts =this.date.split('-');
        var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
        console.log(mydate.toDateString());

        if (!this.payload.area_id) {
            this.alertError = true;
            this.errorMessage = "Por favor, indica el área."
          } else if (!this.payload.product_id) {
            this.alertError = true;
            this.errorMessage = "Por favor, indica el producto."
          } else if (!this.payload.hours) {
            this.alertError = true;
            this.errorMessage = "Por favor, indica las horas."
          } else if (this.payload.hours < 1) {
            this.alertError = true;
            this.errorMessage = "Por favor, indica más de una (1) hora."
          } else if (this.payload.hours > 24) {
            this.alertError = true;
            this.errorMessage = "No puedes registrar más de 24 horas en un día."
          } else if (mydate.getTime() > f.getTime()) {
            this.alertError = true;
            this.errorMessage = "No puedes cargar horas futuras."
          } else {
            ProjectUserDataService.addLoad(loadPayload)
                .then(response => {

                    console.log(response.data);
                })
                .catch(e => {
                console.log(e);
                });

            this.loadDialog = false;
            this.successMessage = "Se han cargado las horas correctamente";
            this.alertSuccess = true;
            location.reload();
          }
    },

    openLoadDialog(itemId, itemName, itemCode){
        this.currentProjectId = itemId;
        this.currentProjectName = itemName;
        this.currentProjectCode = itemCode;
        this.loadDialog = true;
        console.log(itemId, itemName, itemCode);
    },

    openHistoryDialog(itemId, itemName, itemCode){
        this.currentProjectId = itemId;
        this.currentProjectName = itemName;
        this.currentProjectCode = itemCode;
        this.historyDialog = true;
        console.log(itemId, itemName, itemCode);
    },

    retrieveUser() {
      UserDataService.get(this.currentUser.id)
        .then((response) => {
          this.origin_users.push(response.data);
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

    retrieveProjectUsers() {
      ProjectUserDataService.getAll()
        .then((response) => {
          this.origin_project_users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveProjects();
    },

    searchName() {
      ProjectDataService.findByName(this.name)
        .then((response) => {
          this.projects = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    goRoute(route) {
      this.$router.push("/" + route);
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
    retrieveAreas() {
      AreaDataService.getAll()
        .then((response) => {
          this.origin_areas = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveLoads() {
      LoadDataService.getAll()
        .then((response) => {
          this.origin_loads = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },

  },
  watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)
      },
    },
  mounted() {
    this.retrieveProjects();
    this.retrieveProjectUsers();
    this.retrieveProducts();
    this.retrieveAreas();
    this.retrieveUser();
    this.retrieveLoads();
  },
};
</script>

<style>
  .load-list {
    max-width: 950px;
  }
</style>