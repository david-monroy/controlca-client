<template>
<div id="report">
      <v-card class="mx-auto p-3 main-card-report" tile>
        <h4 class="primary--text text-center">{{projectData.name}} - {{projectData.code}}
        </h4>
        <div class="report-main">
            <div class="report-indicators">
              <h5 class="lightgray--text text-center mt-4 mb-3">Avances</h5>
                <div class="report-item">
                    <div class="display: flex; justify-content: center">
                    <h6 class="text-center ma-0" style="display: inline">Horas:</h6>
                    <v-tooltip
                      v-model="show_hours"
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
                      <span>Trabajadas/estimadas</span>
                    </v-tooltip>
                  </div>
                    <p class="my-1">{{total_worked_hours}}/{{total_estimated_hours}}</p>
                    <v-progress-circular 
                        :value="worked_hours_percent"
                        :size="70"
                        :width="7"
                        color="primary"
                        class="report-progress mt-0">
                        {{worked_hours_percent}}%
                    </v-progress-circular>
                    <v-btn @click="goRoute('load-projects')" x-small class="btn simple-btn mt-2">cargar horas</v-btn>
                </div>
                <div class="report-item mt-2">
                  <div class="display: flex; justify-content: center">
                    <h6 class="text-center ma-0" style="display: inline">Avance del proyecto:</h6>
                    <v-tooltip
                      v-model="show_advance"
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
                      v-model="show_users"
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
            <div class="report-indicators">
              <h5 class="lightgray--text text-center mt-4 mb-3">Presupuesto</h5>
                <div class="report-item mb-2" v-for="(bud,b) in projectData.budgets" :key="b">
                  <div class="display: flex; justify-content: center">
                    <h6 class="text-center ma-0" style="display: inline">{{bud.area}}:</h6>
                    <v-tooltip

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
                      <span>Pagado/presupuestado</span>
                    </v-tooltip>
                  </div>
                  <div v-if="bud.area=='Suministro' && bud.price!=0" style="display: flex; flex-direction: column; align-items: center">
                  <p class="my-1">{{bud.paid}}/{{bud.price}} ($USD)</p>
                    <v-progress-circular 
                        :value="budget_suministro"
                        :size="70"
                        :width="7"
                        color="primary"
                        class="report-progress mt-0">
                        {{budget_suministro}}%
                    </v-progress-circular>
                    <v-btn @click="showPaybox(bud.id, bud.area, bud.price, bud.paid)" x-small class="btn simple-btn mt-2">cuadro de pago</v-btn>
                  </div>
                  <div v-if="bud.area=='Instalación' && bud.price!=0" style="display: flex; flex-direction: column; align-items: center">
                  <p class="my-1">{{bud.paid}}/{{bud.price}} ($USD)</p>
                    <v-progress-circular 
                        :value="budget_instalacion"
                        :size="70"
                        :width="7"
                        color="primary"
                        class="report-progress mt-0">
                        {{budget_instalacion}}%
                    </v-progress-circular>
                    <v-btn @click="showPaybox(bud.id, bud.area, bud.price, bud.paid)" x-small class="btn simple-btn mt-2">cuadro de pago</v-btn>
                  </div>
                  <div v-if="bud.area=='Gastos adicionales' && bud.price!=0" style="display: flex; flex-direction: column; align-items: center">
                  <p class="my-1">{{bud.paid}}/{{bud.price}} ($USD)</p>
                    <v-progress-circular 
                        :value="budget_adicionales"
                        :size="70"
                        :width="7"
                        color="primary"
                        class="report-progress mt-0">
                        {{budget_adicionales}}%
                    </v-progress-circular>
                    <v-btn @click="showPaybox(bud.id, bud.area, bud.price, bud.paid)" x-small class="btn simple-btn mt-2">cuadro de pago</v-btn>
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
        <div class="report-bitacora-mobile pa-0">
              <Bitacora
                :project="projectData"
                :project_users="users_worked_hours"
              ></Bitacora>
            </div>
        <template>
              <v-dialog v-model="payboxDialog" max-width="1000px">
                <v-card class="pa-6 pb-2">
                  <div class="mx-auto pb-2">
                        <p class="primary--text text-center">Cuadro de pago de {{temp_budget_area}}</p>
                    </div>
                  <p class="mb-2" style="color: gray; font-size: 14px">* Sólo el líder puede actualizar esta información.</p>
                    <v-simple-table
                        fixed-header
                        height="300px"
                    >
                        <thead>
                            <tr>
                            <th class="text-left">
                                Fecha
                            </th>
                            <th class="text-left">
                                Descripción
                            </th>
                            <th class="text-center">
                                Monto pagado
                            </th>
                            <th class="text-center">
                                Por pagar
                            </th>
                            <th class="text-center">
                                Presupuestado
                            </th>
                            <th class="text-center">
                                Estatus
                            </th>
                            <th class="text-center">
                                Observaciones
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="item in load_budgets_area"
                            :key="item.id"
                            >
                                <td>{{ item.date }}</td>
                                <td>{{ item.description }}</td>
                                <td class="text-center">${{ item.paid.toFixed(2) }}</td>
                                <td class="text-center">${{ item.to_pay.toFixed(2) }}</td>
                                <td class="text-center">${{ item.budget.toFixed(2) }}</td>
                                <td class="text-center">{{ item.status }}</td>
                                <td v-if="item.observations != null" class="text-center">{{ item.observations }}</td>
                                <td v-else class="text-center">-</td>
                                <!-- <td v-if="currentUser.id == projectData.leader_id" class="text-center">
                                    <v-simple-checkbox
                                    v-model="item.area_product.completed"
                                    ></v-simple-checkbox>
                                </td> -->
                                <!-- <td v-else class="text-center">
                                    <v-simple-checkbox
                                    disabled
                                    v-model="item.area_product.completed"
                                    ></v-simple-checkbox>
                                </td> -->
                            </tr>
                        </tbody>
                    </v-simple-table>
                    <v-expansion-panels focusable class="px-5 mt-2 mb-5" v-if="currentUser.id == projectData.leader_id">
            <v-expansion-panel>
                <v-expansion-panel-header>Cargar pago</v-expansion-panel-header>
                <v-expansion-panel-content class="py-4">
                  <v-row class="pa-0 ma-0 form-row-rol">
                    <v-col md="6" cols="12" class="py-0">
                      <v-menu
                        ref="menu"
                        v-model="menu"
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
                            @input="menu = false"
                        ></v-date-picker>
                    </v-menu>
                    </v-col>
              <v-col md="6" cols="12" class="py-0">
                <v-text-field
                    v-model="temp_load_description"
                    label="Descripción"
                    type="text"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="pa-0 ma-0 form-row-rol">
              <v-col md="6" cols="12" class="py-0 mx-auto">
                <v-text-field
                    v-model="temp_load_budget"
                    label="Monto presupuestado"
                    prefix="$"
                    type="number"
                ></v-text-field>
              </v-col>
              <v-col md="6" cols="12" class="py-0 mx-auto">
                <v-text-field
                    v-model="temp_load_paid"
                    label="Monto a pagar"
                    prefix="$"
                    type="number"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="pa-0 ma-0 form-row-rol">
              <v-col md="12" cols="12" class="py-0 mx-auto">
                <v-radio-group
                  v-model="temp_load_status"
                  class="mx-auto" style="display: flex; justify-content: center"
                  row
                >
                  <v-radio class="mb-0"
                    label="Pendiente"
                    value="Pendiente"
                  ></v-radio>
                  <v-radio class="mb-0"
                    label="Completado"
                    value="Completado"
                  ></v-radio>
                  <v-radio class="mb-0"
                    label="No aplica"
                    value="No aplica"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row class="pa-0 ma-0 form-row-rol mt-7">
              <v-col md="12" cols="12" class="py-0 mx-auto">
                <v-textarea
                    v-if="temp_load_status=='Completado'"
                    class="mt-2"
                    v-model="temp_load_observations"
                    label="Observaciones"
                    type="text"
                    height="40"
                    readonly
                ></v-textarea>
                <v-textarea
                    v-else
                    v-model="temp_load_observations_pendiente"
                    label="Observaciones (opcional)"
                    type="text"
                    height="40"
                ></v-textarea>
              </v-col>
        </v-row>
        <v-btn class="simple-btn mt-2 mx-auto btn-block w-75" @click="loadPay()">
          Cargar pago
        </v-btn>
        </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
                </v-card>
              </v-dialog>
              <v-dialog v-model="productsDialog" max-width="500px">
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
</div>
</template>

<script>
import UserDataService from "../../services/UserDataService";
import ProjectUserDataService from "../../services/ProjectUserDataService";
import ProjectDataService from "../../services/ProjectDataService";
import AreaDataService from "../../services/AreaDataService";
import Bitacora from "../../components/reports/Bitacora.vue";
import BudgetDataService from "../../services/BudgetDataService";
import LoadBudgetDataService from "../../services/LoadBudgetDataService";
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
      origin_budgets: [],
      origin_load_budgets: [],
      projectData: null,
      productsDialog: false,

      show_hours: false,
      show_advance: false,
      show_users: false,
      show_budget: false,

      temp_budget: 0,
      temp_budget_paid: 0,
      temp_budget_area: 0,
      temp_budget_price: 0,
      temp_budget_paid_new: 0,

      temp_load_budget: null,
      temp_load_paid: null,
      temp_load_description: null,
      temp_load_status: null,
      temp_load_observations_pendiente: null,

      payboxDialog: false,

      timeout: 4000,
      alertSuccess: false,
      successMessage: "",
      alertError: false,
      errorMessage: "",

      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      menu: false,
      actual_date: new Date(),
    }
  },
  computed: {
    computedDateFormatted () {
        return this.formatDate(this.date)
      },
    temp_load_observations(){
      let value = null;
      let saved = this.temp_load_budget - this.temp_load_paid;
      if (this.temp_load_status=="Completado"){
        value = "Se ahorraron $" + saved.toFixed(2);
      } else {
        value = this.temp_load_observations_pendiente;
      }
      return value;
    },
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
        return percent.toFixed(0);
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
        return percent.toFixed(0);
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
    },
    budget_suministro(){
      let price = 0;
      let paid = 0;
      this.origin_budgets.forEach(bud => {
        if (bud.area == "Suministro" && bud.project_id == this.projectData.id){
          this.origin_load_budgets.forEach(load => {
            if (load.budget_id == bud.id){
              paid += load.paid;
            }
          });
          price = bud.price
        }
      });
      let percent = (paid * 100)/price;
      return percent.toFixed(0); 
    },
    budget_instalacion(){
      let price = 0;
      let paid = 0;
      this.origin_budgets.forEach(bud => {
        if (bud.area == "Instalación" && bud.project_id == this.projectData.id){
          this.origin_load_budgets.forEach(load => {
            if (load.budget_id == bud.id){
              paid += load.paid;
            }
          });
          price = bud.price
        }
      });
      let percent = (paid * 100)/price;
      return percent.toFixed(0);
    },
    budget_adicionales(){
      let price = 0;
      let paid = 0;
      this.origin_budgets.forEach(bud => {
        if (bud.area == "Gastos adicionales" && bud.project_id == this.projectData.id){
          this.origin_load_budgets.forEach(load => {
            if (load.budget_id == bud.id){
              paid += load.paid;
            }
          });
          price = bud.price
        }
      });
      let percent = (paid * 100)/price;
      return percent.toFixed(0);
    },
    load_budgets_area(){
      let loads = [];
      this.origin_load_budgets.forEach(load => {
        this.projectData.budgets.forEach(bud => {
          if (load.budget_id == bud.id){
            if (load.area == this.temp_budget_area){
              if (load.paid > load.budget) load.to_pay = 0;
              else load.to_pay = load.budget - load.paid;
              loads.push(load);
            }
          }
        });
      });
      return loads;
    }
  },
  methods: {
    savePaid(){
      if (this.temp_budget_paid_new > 0){
        let paid_new_integer = parseInt(this.temp_budget_paid_new, 10);
            let data = {
              paid: this.temp_budget_paid + paid_new_integer,
            };
            BudgetDataService.update(this.temp_budget, data)
              .then((response) => {
                  console.log(response.data);
                  })
                  .catch((e) => {
                  console.log(e);
                  });

            this.payboxDialog = false;
            this.successMessage = "Se ha marcado el pago correctamente. Espere a que actualice.";
            this.alertSuccess = true;
            location.reload();
      } else {
        this.errorMessage = "Introduce una cantidad mayor a cero (0)."
        this.alertError = true;
      }
      
    },
    goRoute(route) {
      this.$router.push("/" + route);
    },
    goReports(id) {
      this.$router.push("/reports/" + id);
    },
    showPaybox(id, area, price, paid){
      this.temp_budget = id;
      this.temp_budget_area = area;
      this.temp_budget_price = price;
      this.temp_budget_paid = paid
      this.payboxDialog = true;
    },
    loadPay(){
      let loadPayload = null;
        console.log(loadPayload);
        let f = (this.actual_date);
        console.log(f);
        var parts =this.date.split('-');
        var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
        console.log(mydate.toDateString());

        if (mydate.getTime() > f.getTime()) {
            this.alertError = true;
            this.errorMessage = "No puedes cargar días futuros."
        } else {
          this.projectData.budgets.forEach(bud => {
            if (bud.area == this.temp_budget_area) {
              loadPayload = {
                  date: this.dateFormatted,
                  observations: this.temp_load_observations,
                  description: this.temp_load_description,
                  budget: this.temp_load_budget,
                  paid: this.temp_load_paid,
                  budget_id: bud.id,
                  area: this.temp_budget_area,
                  status: this.temp_load_status,
              }
              BudgetDataService.load(loadPayload)
              .then(response => {
                  console.log(response.data);
              })
              .catch(e => {
              console.log(e);
              });

              let paid_new_float = parseFloat(this.temp_load_paid);
            let data = {
              paid: this.temp_budget_paid + paid_new_float,
            };
            BudgetDataService.update(this.temp_budget, data)
              .then((response) => {
                  console.log(response.data);
                  })
                  .catch((e) => {
                  console.log(e);
                  });

            this.payboxDialog = false;
            this.successMessage = "Se ha marcado el pago correctamente. Espere a que actualice.";
            this.alertSuccess = true;
            location.reload();
            }       
          });  
        }
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
    retrieveBudgets() {
      BudgetDataService.getAll()
        .then((response) => {
          this.origin_budgets = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveLoadBudgets() {
      LoadBudgetDataService.getAll()
        .then((response) => {
          this.origin_load_budgets = response.data;
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
    this.retrieveUsers();
    this.retrieveAreas();
    this.retrieveProjectUsers();
    this.getProject(this.$route.params.id);
    this.retrieveBudgets();
    this.retrieveLoadBudgets();
  },
};
</script>

<style>
    .report-main{
        display: flex;
    }
    .main-card-report{
    width: 100%  !important;
    padding: 30px;
  }
    .report-indicators{
        flex: 1;
        /* background-color: #ecebe5a4; */
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        border-radius: 8px;
    }
    .report-budget{
        flex: 1;
    }
    .report-bitacora{
        flex: 2;
    }
    .report-bitacora-mobile{
        display: none;
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
    .v-radio .v-label {
      margin: 0 !important;
    }
    @media only screen and (max-width: 992px) {
      .report-bitacora{
        display: none;
    }
    .report-bitacora-mobile{
        display: block;
    }
    }
</style>