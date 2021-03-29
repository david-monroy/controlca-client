<template>
  <div class="col-md-12 mt-3 pt-1">
    <v-stepper v-model="formStep" class="mt-0 form-card stepper-offer mx-auto">
    <v-stepper-header>
      <v-stepper-step
        :complete="formStep > 1"
        step="1"
      >
        Datos generales
      </v-stepper-step>

      <v-divider></v-divider>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="formStep > 2"
        step="2">
        Involucrados
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">
        Confirmar
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-row class="pb-0 mb-0 pt-2 form-row" >
            <v-col md="12" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="offerData.name"
                        
                        label="Nombre"
                        required
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>
          <input type="hidden" value="currentUser.id">
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="4" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="offerData.code"
                        label="Código"
                        name="code"
                        v-mask="'#####'"
                        type="number"
                        required
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="4" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="offerData.number"
                        name="number"
                        label="Número de oferta"
                        v-mask="'X###'"
                        required
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="4" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="offerData.codification"
                        name="codification"
                        label="Codificación"
                        v-mask="'###'"
                        type="number"
                        required
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="12" cols="12" class="py-0">
                <div class="form-group">
                    <v-textarea
                        v-model="offerData.description"
                        filled height="100"
                        label="Descripción (opcional)"
                        required
                    ></v-textarea>
                </div>
            </v-col>
          </v-row>

        <div style="display: flex; justify-content: space-between">
            <v-btn text color="red"
            @click="confirmCancel = true">
                Cancelar
            </v-btn>
            <v-btn
                color="primary"
                @click="validateStep1()"
                >
                Siguiente
                </v-btn>
        </div>
        
      </v-stepper-content>

      <v-stepper-content step="2">
        <div v-if="offerData.workers.length>0">
            <v-simple-table max-height="240px" >
                <template v-slot:default>
                    <thead >
                            <tr>

                            <th class="text-center">
                                Nombre
                            </th>
                            <th class="text-center">
                                Apellido
                            </th>
                            <th class="text-center">
                                Rol
                            </th>
                            <th class="text-center">
                                Eliminar
                            </th>
                            </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(worker,w) in offerData.workers"
                        :key="w"
                        >
                        <td class="text-center">{{ worker.name }}</td>
                        <td class="text-center">{{ worker.lastname }}</td>
                        <td class="text-center">{{ worker.roster }}</td>
                        <td v-if="w>0" class="text-center">
                            <v-icon small class="text-center" 
                            color="red" @click="removeWorker(w)">mdi-delete</v-icon>
                        </td>
                        <td v-else class="text-center">
                            <v-icon small class="text-center" disabled
                            color="red" @click="removeWorker(w)">mdi-delete</v-icon>
                        </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
        </div>
        <div v-else class="no-items-label mx-5 mb-3 pa-5">
            <p class="text-body-2 ma-0">Ningún involucrado añadido, agrega uno usando el siguiente panel: </p>
        </div>
        <v-expansion-panels focusable class="px-5 mt-2 mb-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Añadir involucrado</v-expansion-panel-header>
                <v-expansion-panel-content class="py-4">
            <v-row class="pa-0 ma-0 form-row-rol">
              <v-col md="6" cols="12" class="py-0">
                <v-select
                    v-model="temp_worker_roster"
                    :items="roster_list"
                    label="Rol"
                    dense
                    required
                ></v-select>
              </v-col>
              <v-col md="6" cols="12" class="py-0"
              v-if="temp_worker_roster == 'Director' || temp_worker_roster == 'Gerente'">
                    <v-select
                        v-model="temp_worker_id"
                        :items="origin_workers_admin"
                        label="Involucrado"
                        item-text="completeName"
                        item-value="id"
                        dense
                        required
                    ></v-select>
                </v-col>
              <!-- <v-col md="6" cols="12" class="py-0"
              v-else-if="temp_worker_roster == 'Líder'">
                    <v-select
                        v-model="temp_worker_id"
                        :items="origin_workers_offers"
                        label="Involucrado"
                        item-text="completeName"
                        item-value="id"
                        dense
                        required
                    ></v-select>
                </v-col> -->
              <v-col md="6" cols="12" class="py-0"
              v-else>
                    <v-select
                        v-model="temp_worker_id"
                        :items="origin_workers_hours"
                        label="Involucrado"
                        item-text="completeName"
                        item-value="id"
                        dense
                        required
                    ></v-select>
                
              </v-col>
            </v-row>
        <v-btn class="simple-btn mt-2 mx-auto btn-block w-75" @click="addWorkerToOffer()">
          Añadir a la oferta
        </v-btn>
        </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>

        <div style="display: flex; justify-content: space-between">
            <v-btn text color="red"
            @click="confirmCancel = true">
                Cancelar
            </v-btn>
            <v-btn text color="primary"
            @click="formStep = 1">
                Regresar
            </v-btn>
            <v-btn
                color="primary"
                @click="validateStep2()"
                >
                Siguiente
                </v-btn>
        </div>
      </v-stepper-content>
      <v-stepper-content step="3">

        <div class="no-items-label mb-3 pa-5">
            <p class="text-body-2 ma-0">Confirme la información. Recuerde que una vez registrada la oferta, no podrá modificar los involucrados añadidos.</p>
        </div>
        <div class="offer-confirm-section pa-4 body-2 mb-4">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <strong>Código: </strong> <p>{{offerData.code}}</p>
                </div>
                <div>
                    <strong>Número: </strong> <p>{{offerData.number}}</p>
                </div>
                <div>
                    <strong>Codificación: </strong> <p>{{offerData.codification}}</p>
                </div>
                <div>
                    <strong>Líder: </strong> <p>{{currentUser.name}} {{currentUser.lastname}}</p>
                </div>
            </div>
            
            <div class="mb-2 pb-0 body-2" v-if="offerData.description">
                <p><strong>Descripción: </strong>{{offerData.description}}</p> 
            </div>
        </div>

        <v-expansion-panels focusable class="pa-0 mb-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Involucrados ({{offerData.workers.length}})</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-simple-table max-height="240px" >
                        <template v-slot:default>
                        <thead >
                            <tr>
                            <th class="text-center">
                                Nombre
                            </th>
                            <th class="text-center">
                                Apellido
                            </th>
                            <th class="text-center">
                                Rol
                            </th>
                            <th class="text-center">
                                Eliminar
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(worker,w) in offerData.workers"
                            :key="w"
                            >
                            <td class="text-center">{{ worker.name }}</td>
                            <td class="text-center">{{ worker.lastname }}</td>
                            <td class="text-center">{{ worker.roster }}</td>
                            <td v-if="w>0" class="text-center">
                                <v-icon small class="text-center" 
                                color="red" @click="removeWorker(w)">mdi-delete</v-icon>
                            </td>
                            <td v-else class="text-center">
                                <v-icon small class="text-center" disabled
                                color="red" @click="removeWorker(w)">mdi-delete</v-icon>
                            </td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        

        <div style="display: flex; justify-content: space-between">
            <v-btn text color="red"
            @click="confirmCancel = true">
                Cancelar
            </v-btn>
            <v-btn text color="primary"
            @click="formStep = 2">
                Regresar
            </v-btn>
            <v-btn
                color="primary"
                @click="saveOffer()"
                >
                Guardar
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
                <v-btn class="simple-btn" text @click="formStep = 3; confirmWorkers = false">Sí, continuar</v-btn>
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
                <v-btn class="simple-btn" text @click="goRoute('offers')">Sí, salir</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>

</template>

<script>
import UserDataService from "../../services/UserDataService";
import OfferDataService from "../../services/OfferDataService";
export default {
  name: "offers-add",
  data: () => ({
      formStep: 1,
      offerData: {
          name: "",
          description: null,
          code: "",
          number: "",
          codification: "",
          leader: null,
          workers: [],
      },

      roster_list: [
          "Director",
          "Gerente",
        //   "Líder",
          "Colaborador"
      ], 

      origin_workers: [],
      temp_worker_id: null,
      temp_worker_roster: null,

      origin_offers: [],
      error_add_workers: false,
      error_add_products: false,

      timeout: 4000,
      alertError: false,
      errorMessage: null,

      confirmWorkers: false,
      confirmCancel: false,
      counter: 1,
  }),
  computed: {
    currentUser() {    
      return this.$store.state.auth.user;
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
    origin_workers_offers() {
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
    }
  },
  methods: {
      validateStep1(){
          if (!this.offerData.name){
              this.errorMessage = "Debes indicar el nombre de la oferta."
              this.alertError = true;
          } else if (!this.offerData.code) {
              this.errorMessage = "Debes indicar el código de la oferta."
              this.alertError = true;
          } else if (!this.offerData.number) {
              this.errorMessage = "Debes indicar el número de la oferta."
              this.alertError = true;
          } else if (!this.offerData.codification) {
              this.errorMessage = "Debes indicar la codificación de la oferta."
              this.alertError = true;
          } else {
              let itExists = false;
              this.origin_offers.forEach(offer => {
                  if (this.offerData.number == offer.number) {
                      itExists = true;
                  }
              });
              if (itExists) {
                  this.errorMessage = "Ya existe un proyecto con el número " + this.offerData.number;
                  this.alertError = true;
              }
              else {
                  this.formStep = 2;
                  if (this.counter == 1){
                      this.offerData.workers.push({
                        id: this.currentUser.id, 
                        roster: "Líder",
                        name: this.currentUser.name,
                        lastname: this.currentUser.lastname,
                    });
                    this.counter++;
                  }
              }
          }
      },
      validateStep2(){
          if (this.offerData.workers.length < 2){
              this.confirmWorkers = true;
          } else this.formStep = 3;
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
    retrieveOffers() {
      OfferDataService.getAll()
        .then((response) => {
          this.origin_offers = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addWorkerToOffer(){
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
            this.offerData.workers.forEach(worker => {
                if (worker.id == this.temp_worker_id) itExists = true;
            });
            if (!itExists) {
                this.origin_workers.forEach(op => {
                    if (op.id==this.temp_worker_id) {
                        worker_name = op.name;
                        worker_lastname = op.lastname;
                    } 
                });
                this.offerData.workers.push({
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
    removeWorker(pos){
        return this.offerData.workers.splice(pos, 1);
    },
    async saveOffer() {
      var data = {
        name: this.offerData.name,
        description: this.offerData.description,
        code: this.offerData.code,
        number: this.offerData.number,
        codification: this.offerData.codification,
        leader: this.currentUser.id,
      };
      let offer_id = await OfferDataService.create(data);

        let workerData = null;
        this.offerData.workers.forEach(workerToAdd => {    
            workerData = {
                offer: offer_id.data.id,
                worker: workerToAdd.id,
                roster: workerToAdd.roster,
            }
            console.log(workerData);

            OfferDataService.addUser(workerData)
                .then(response => {
                console.log(response.data);
                })
                .catch(e => {
                console.log(e);
                });
        });

        this.goRoute("offers");

    },
    console(){
        console.log(this.offerData);
        console.log(this.origin_offers);
    },
    goRoute(route) {
      this.$router.push("/" + route);
    },
  },
  mounted() {
      this.retrieveUsers();
      this.retrieveOffers();
  }
}
</script>

<style>
    .stepper-offer{
        width: 60%;
    }
    .add-product-section{
        border: 1px solid lightgray;
        border-radius: 20px;
        padding-top: 10px;
        margin-bottom: 10px;
    }
    .offer-confirm-section{
        border: 1px solid lightgray;
        border-radius: 10px;
        padding: 8px;
    }
  .no-items-label{
      background-color: rgba(219, 214, 214, 0.301);
      border-radius: 10px;
  }
</style>