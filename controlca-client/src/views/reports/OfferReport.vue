<template>
<div id="report">
      <v-card class="mx-auto p-3 main-card-report" tile>
        <h4 class="primary--text text-center">{{offerData.name}} - {{offerData.code}}
        </h4>
        <div class="report-main">
            <div class="report-indicators">
              <h5 class="lightgray--text text-center mt-4 mb-3">Avances</h5>
                <div class="report-item mt-2">
                  <div class="display: flex; justify-content: center">
                    <h6 class="text-center ma-0" style="display: inline">Usuarios en la oferta:</h6>
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
                        <p class="ma-0 text-center w-100 mb-1">{{item.name}} {{item.lastname}} <span class="secondary--text">- {{item.offer_user.roster}}</span> </p>
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
                <div  v-for="(bud,b) in offerData.budget_offers" :key="b">
                  <div v-if="bud.area=='Gastos adicionales' && bud.price!=0" class="report-item mb-2">
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
                    <div style="display: flex; flex-direction: column; align-items: center">
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
                
            </div>
            <div class="report-bitacora pa-4">
              <BitacoraOffer
                :offer="offerData"
                :offer_users="users_worked_hours"
              ></BitacoraOffer>
            </div>
        </div>
        <div class="report-bitacora-mobile pa-0">
              <BitacoraOffer
                :offer="offerData"
                :offer_users="users_worked_hours"
              ></BitacoraOffer>
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
                                <!-- <td v-if="currentUser.id == offerData.leader_id" class="text-center">
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
                    <v-expansion-panels focusable class="px-5 mt-2 mb-5" v-if="currentUser.id == offerData.leader_id">
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
                    v-if="temp_load_status=='Completado' || temp_load_status=='Pendiente'"
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
                                <td v-if="currentUser.id == offerData.leader_id" class="text-center">
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
import OfferUserDataService from "../../services/OfferUserDataService";
import OfferDataService from "../../services/OfferDataService";
import BitacoraOffer from "../../components/reports/BitacoraOffer.vue";
import BudgetOfferDataService from "../../services/BudgetOfferDataService";
import LoadBudgetOfferDataService from "../../services/LoadBudgetOfferDataService";
export default {
  name: "offer-report",
  components: {
    BitacoraOffer,
  },
  data() {
    return {
      origin_users: [],
      origin_offer_users: [],
      origin_budgets: [],
      origin_load_budgets: [],
      offerData: null,

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
      } else if (this.temp_load_status=="Pendiente"){
        value = "Faltan por pagar $" + saved.toFixed(2);
      } else {
        value = this.temp_load_observations_pendiente;
      }
      return value;
    },
    currentUser() {      
      return this.$store.state.auth.user;
    },
    total_worked_hours(){
      let hours = 0;
      this.origin_offer_users.forEach(pu => {
        if (this.offerData.id == pu.offer_id){
          pu.loads.forEach(load => {
            hours = hours + load.hours;
          });
        }
      });
      return hours;
    },
    users_worked_hours(){
      let users = [];
      let load_hours;
      this.offerData.working_users.forEach(worker => {
        load_hours = 0;
        this.origin_offer_users.forEach(pu => {
          if (pu.offer_id == this.offerData.id) {
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
    budget_adicionales(){
      let price = 0;
      let paid = 0;
      this.origin_budgets.forEach(bud => {
        if (bud.area == "Gastos adicionales" && bud.offer_id == this.offerData.id){
          this.origin_load_budgets.forEach(load => {
            if (load.budget_offer_id == bud.id){
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
        this.offerData.budget_offers.forEach(bud => {
          if (load.budget_offer_id == bud.id){
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
            BudgetOfferDataService.update(this.temp_budget, data)
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
          this.offerData.budget_offers.forEach(bud => {
            if (bud.area == this.temp_budget_area) {
              loadPayload = {
                  date: this.dateFormatted,
                  observations: this.temp_load_observations,
                  description: this.temp_load_description,
                  budget: this.temp_load_budget,
                  paid: this.temp_load_paid,
                  budget_offer_id: bud.id,
                  area: this.temp_budget_area,
                  status: this.temp_load_status,
              }
              BudgetOfferDataService.load(loadPayload)
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
            BudgetOfferDataService.update(this.temp_budget, data)
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
    retrieveUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.origin_users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveOfferUsers() {
      OfferUserDataService.getAll()
        .then((response) => {
          this.origin_project_users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveBudgets() {
      BudgetOfferDataService.getAll()
        .then((response) => {
          this.origin_budgets = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveLoadBudgets() {
      LoadBudgetOfferDataService.getAll()
        .then((response) => {
          this.origin_load_budgets = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getOffer(id) {
      OfferDataService.get(id)
        .then((response) => {
          this.offerData = response.data;
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
    this.retrieveOfferUsers();
    this.getOffer(this.$route.params.id);
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
        width: 220px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0;
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