<template>
    <v-row class="pa-6">
        <h5 class="lightgray--text text-center">Bitácora</h5>
        <v-expansion-panels focusable class="px-5 mt-2 mb-5" >
            <v-expansion-panel>
                <v-expansion-panel-header>Añadir nota</v-expansion-panel-header>
                <v-expansion-panel-content class="py-4 px-4">
                    <v-row class="pb-0 mb-0 form-row" >
                        <v-col md="6" cols="12" class="py-0 mx-auto">
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
                    </v-row>
                    <v-row class="pb-0 mt-2 mb-0 form-row" >
                        <v-col md="12" cols="12" class="py-0 mx-auto">
                            <div class="form-group">
                                <v-textarea
                                    v-model="note"
                                    filled height="60"
                                    label="Nota"
                                    required
                                    style="margin-bottom: -22px"
                                ></v-textarea>
                            </div>
                        </v-col>
                    </v-row>
                    <v-btn class="simple-btn mx-auto btn-block w-75" @click="saveBitacora()">
                    Añadir
                    </v-btn>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div class="item-bitacora py-2">
            <div v-for="item in offer_bitacoras" :key="item.id" >
                <div class="bitacora-item">
                    <div class="bitacora-header">
                        <v-chip
                            class="ma-2 bitacora-chip text-center primary d-none d-sm-flex"
                            small
                            label
                        >
                            {{item.date}}
                        </v-chip>
                        <v-chip
                            class="ma-4 bitacora-chip bitacora-chip-mobile text-center primary d-flex d-sm-none"
                        >
                            {{item.date}}
                        </v-chip>
                        <p class="ma-0 primary--text"><strong>{{item.user_name}} {{item.user_lastname}}</strong></p>
                    </div>
                    <div class="bitacora-note pl-2">
                        {{item.note}}
                    </div>
                </div>
        </div>
        </div>
        
    </v-row>
</template>

<script>
import UserDataService from "../../services/UserDataService";
// import ProjectDataService from "../../services/ProjectDataService";
import OfferUserDataService from "../../services/OfferUserDataService";
import BitacoraOfferDataService from "../../services/BitacoraOfferDataService";
export default {
    name: "offer-bitacora",
    data() {
        return {
            note: null,
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
            menu1: false,
            origin_bitacoras: [],
            origin_project_users: [],
            origin_users: [],
        }
    },
    props: {
        offer: Object,
        offer_users: Array,
    },
    computed: {
      currentUser() {      
        return this.$store.state.auth.user;
        },
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
      offer_bitacoras(){
          let bitacoras = [];
          let name = "";
          let lastname = "";
          this.origin_bitacoras.forEach(bitacora => {
              if (bitacora.offer_user.offer_id == this.offer.id){
                  this.origin_users.forEach(user => {
                      if (bitacora.offer_user.worker_id == user.id){
                          name = user.name;
                          lastname = user.lastname;
                      }
                  });
                  bitacora.user_name = name;
                  bitacora.user_lastname = lastname;
                  bitacoras.push(bitacora);
              }
          });
          return bitacoras.reverse();
      },
      offer_user_id(){
        let pu_id = 0;
        this.origin_offer_users.forEach(pu => {
            if ((this.currentUser.id == pu.worker_id) && (this.offer.id == pu.offer_id)){
            pu_id = pu.id;
            }
        });
        return pu_id
      },
    },
    methods: {
      saveBitacora(){
        
        let payload = {
            offer_user: this.offer_user_id,
            date: this.dateFormatted,
            note: this.note,
        }
        console.log(payload);

        OfferUserDataService.addBitacora(payload)
            .then(response => {

                console.log(response.data);
            })
            .catch(e => {
            console.log(e);
            });

        this.note = null;
        // this.successMessage = "Se han cargado las horas correctamente";
        // this.alertSuccess = true;
        location.reload();
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
      retrieveBitacoras() {
      BitacoraOfferDataService.getAll()
        .then((response) => {
          this.origin_bitacoras = response.data;
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
    retrieveUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.origin_users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    },
    watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)
      },
    },
    mounted() {
        this.retrieveBitacoras();
        this.retrieveOfferUsers();
        this.retrieveUsers();
    }
}
</script>

<style>
    .item-bitacora{
        background-color: #f5d7a02d;
        border-radius: 8px;
    }
    .bitacora-chip{
        max-width: 20%;

    }
    .bitacora-header{
        display: flex;
        align-items: center
    }
    .bitacora-item {
        border-bottom: 1px lightgray solid;
        padding: 15px 0;
    }
    .bitacora-chip-mobile{
        min-width: 94px !important;
    }
</style>