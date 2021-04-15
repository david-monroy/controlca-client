<template>
  <v-row align="center" class="load-list px-3 mt-2 mx-auto">
    <v-col cols="12" sm="12">
      <v-card class="mx-auto p-3" tile max-width="500px" style="display: flex; flex-direction: column; align-items: center">
        <v-card-title> <span class="primary--text">Cargar horas administrativas</span>
        </v-card-title>
        <div class="mt-5 px-10">
            <v-row class="pb-0 mb-0 form-row" >
                <v-col md="12" cols="12" class="py-0">
                    <v-select
                    v-model="load.type"
                    :items="load_types"
                    label="Tipo"
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
                <v-col md="6" cols="12" class="py-0" v-if="load.type != 'Vacaciones'">
                    <v-text-field
                        v-model="load.hours"
                        label="Horas"
                        name="hours"
                        type="number"
                    ></v-text-field>
                </v-col>
                <v-col md="6" cols="12" class="py-0" v-else>
                    <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="finalDateFormatted"
                                label="Fecha final"
                                hint="MM/DD/AAAA"
                                persistent-hint
                                prepend-icon="mdi-calendar"
                                v-bind="attrs"
                                @blur="finalDate = parseDate(finalDateFormatted)"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="finalDate"
                            no-title
                            @input="menu2 = false"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
            <v-row>
            <v-col md="12" cols="12" class="py-0">
                    <div class="form-group">
                        <v-textarea
                            v-model="load.observations"
                            filled height="100"
                            label="Observaciones (opcional)"
                            required
                        ></v-textarea>
                    </div>
                </v-col>
            </v-row>
            <v-btn class="simple-btn mt-5 mx-auto btn-block w-75" @click="saveLoad()">
                Cargar horas
            </v-btn>
            <v-btn class="simple-btn mt-5 mx-auto btn-block w-50" @click="openHistoryDialog()">
                <v-icon small class="mr-2">mdi-history</v-icon>
                Historial
            </v-btn>
            <v-card-actions>
            <v-spacer></v-spacer>
                <v-btn class="secondary--text" text @click="goRoute('loads')">Regresar</v-btn>
            <v-spacer></v-spacer>
            </v-card-actions>
        </div>
        <v-dialog v-model="historyDialog" max-width="700px">
                <v-card class="pa-10 pb-2">
                    <div class="mx-auto pb-2">
                        <p class="primary--text text-center">Historial de horas administrativas</p>
                    </div>
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
                                Horas/Fecha final
                            </th>
                            <th class="text-left">
                                Tipo
                            </th>
                            <th class="text-left">
                                Observaciones
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="item in history_loads"
                            :key="item.id"
                            >
                                <td>{{ item.initial_date }}</td>
                                <td v-if="item.type=='Vacaciones'">{{ item.final_date }}</td>
                                <td v-else>{{ item.hours }}</td>
                                <td>{{ item.type }}</td>
                                <td>{{ item.observations }}</td>
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
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import LoadAdminDataService from "../../services/LoadAdminDataService";
export default {
  name: "load-administration",
  data (){
      return {
      load: {
          type: null,
          hours: null,
          initial_date: null,
          final_date: null,
          observations: null,
      },
      load_types: [
          "Mejoramiento profesional",
          "Permiso recuperable",
          "Permiso no recuperable",
          "Enfermedad",
          "Ausencia autorizada",
          "Vacaciones"
      ],

      origin_loads: [],

      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      finalDate: new Date().toISOString().substr(0, 10),
      finalDateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      menu2: false,

      alertSuccess: false,
      successMessage: "",
      timeout: 4000,
      historyDialog: false,

      alertError: false,
      errorMessage: "",
      actual_date: new Date(),
      }
  },
  computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
      computedFinalDateFormatted () {
        return this.formatDate(this.finalDate)
      },
    currentUser() {      
      return this.$store.state.auth.user;
    },
    history_loads(){
      let loads = [];
      this.origin_loads.forEach(load => {
          if (load.user_id == this.currentUser.id ) {
                loads.push(load);  
          }
      });
      return loads.reverse();
    }
  },
  methods: {
      saveLoad(){
          let loadPayload = {
            user: this.currentUser.id,
            type: this.load.type,
            initial_date: this.dateFormatted,
            final_date: this.finalDateFormatted,
            hours: this.load.hours,
            observations: this.load.observations,
        }
        console.log(loadPayload);
        let f = (this.actual_date);
        console.log(f);
        var parts =this.date.split('-');
        var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
        console.log(mydate.toDateString());

        if (this.load.type == "Vacaciones") {
          if (!this.load.type) {
            this.alertError = true;
            this.errorMessage = "Por favor, indica el tipo."
          } else if (this.dateFormatted > this.finalDateFormatted) {
            this.alertError = true;
            this.errorMessage = "La fecha de inicio no puede ser mayor a la final."
          } else {
            LoadAdminDataService.create(loadPayload)
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
          } else {
          if (!this.load.type) {
            this.alertError = true;
            this.errorMessage = "Por favor, indica el tipo."
          } else if (!this.load.hours) {
            this.alertError = true;
            this.errorMessage = "Por favor, indica las horas."
          } else if (mydate.getTime() > f.getTime()) {
            this.alertError = true;
            this.errorMessage = "No puedes cargar horas futuras para este tipo."
          } else {
            LoadAdminDataService.create(loadPayload)
              .then(response => {

                  console.log(response.data);
              })
              .catch(e => {
              console.log(e);
              });

              this.loadDialog = false;
              this.successMessage = "Se han cargado las horas correctamente";
              this.alertSuccess = true;
          }
        }
      },
      openHistoryDialog(){
        this.historyDialog = true;
    },
    retrieveLoads() {
      LoadAdminDataService.getAll()
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
      goRoute(route) {
      this.$router.push("/" + route);
    },
  },
  watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)
      },
      finalDate () {
        this.finalDateFormatted = this.formatDate(this.finalDate)
      },
    },
    mounted(){
      this.retrieveLoads();
    }
};
</script>

<style>
</style>