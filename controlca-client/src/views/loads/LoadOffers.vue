<template>
  <v-row align="center" class="load-list px-3 mt-2 mx-auto">
    <v-col cols="12" sm="12">
      <v-card class="mx-auto p-3" tile>
        <v-card-title> <span class="primary--text">Cargar horas en oferta</span>
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
          :items="user_offers"
          :hide-default-footer="false"
          :items-per-page="5"
          :search="search"
        >

        <template v-slot:top>
              <v-dialog v-model="loadDialog" max-width="500px">
                <v-card class="pa-10 pb-2">
                    <div class="mx-auto pb-2">
                        <p class="primary--text text-center">Cargar horas - {{currentOfferName}} - {{currentOfferCode}}</p>
                    </div>
                    <div>
                    
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
                    <v-btn class="secondary--text" text @click="loadDialog = false">Cancelar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="openLoadDialog(item.id, item.name, item.code)" class="mr-2 primary--text">mdi-plus-circle</v-icon>
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
import OfferDataService from "../../services/OfferDataService";
import OfferUserDataService from "../../services/OfferUserDataService";
import UserDataService from "../../services/UserDataService";

export default {
  name: "load-offers",
  data() {
    return {
      origin_offers: [],
      origin_offer_users: [],
      origin_users: [],
      currentOfferId: "",
      currentOfferName: "",
      currentOfferCode: "",
      loadOfferHours: 'load-offer-hours',
      goBack: "dashboard",
      title: "",
      search: "",
      headers: [
        { text: "Nombre", align: "start", sortable: true, value: "name" },
        { text: "Código", value: "code", sortable: true },
        { text: "Department", value: "department", sortable: true },
        { text: "Rol", value: "offer_user.roster", sortable: true },
        { text: "Horas trabajadas", value: "worked_hours", sortable: true },
        { text: 'Cargar', value: 'actions', sortable: false },
      ],
      expanded: [],
      singleExpand: true,

      payload: {
          offer_id: "",
      },

      loadDialog: false,

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
    user_offers(){
        let offers = [];
        let hours;
        this.origin_users.forEach(user => {
            user.working_offers.forEach(wp => {
              hours = 0;
              this.origin_offer_users.forEach(ou => {
                if ((this.currentUser.id == ou.worker_id) && (wp.id == ou.offer_id)){
                  ou.load_offers.forEach(load => {
                    hours = hours + load.hours;
                  });
                }
              });
                wp.worked_hours = hours;
                console.log(wp.worked_hours);
                offers.push(wp);
            });
            
        });
        return offers;
    },
    offer_user_id(){
      let ou_id = 0;
      this.origin_offer_users.forEach(ou => {
        if ((this.currentUser.id == ou.worker_id) && (this.currentOfferId == ou.offer_id)){
          ou_id = ou.id;
        }
      });
      return ou_id
    },
  },

  methods: {

    saveHours(){
        
        let loadPayload = {
            offer_user: this.offer_user_id,
            date: this.dateFormatted,
            hours: this.payload.hours,
            observations: this.payload.observations,
        }
        console.log(loadPayload);
        let f = (this.actual_date);
        console.log(f);
        var parts =this.date.split('-');
        var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
        console.log(mydate.toDateString());

        if (!this.payload.hours) {
            this.alertError = true;
            this.errorMessage = "Por favor, indica las horas."
          } else if (mydate.getTime() > f.getTime()) {
            this.alertError = true;
            this.errorMessage = "No puedes cargar horas futuras."
          } else {
            OfferUserDataService.addLoad(loadPayload)
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
        this.currentOfferId = itemId;
        this.currentOfferName = itemName;
        this.currentOfferCode = itemCode;
        this.loadDialog = true;
        console.log(itemId);
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

    retrieveOffers() {
      OfferDataService.getAll()
        .then((response) => {
          this.origin_offers = response.data;
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

    refreshList() {
      this.retrieveOffers();
    },

    searchName() {
      OfferDataService.findByName(this.name)
        .then((response) => {
          this.offers = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    goRoute(route) {
      this.$router.push("/" + route);
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
    this.retrieveOffers();
    this.retrieveOfferUsers();
    this.retrieveUser();
  },
};
</script>

<style>
  .load-list {
    max-width: 950px;
  }
</style>