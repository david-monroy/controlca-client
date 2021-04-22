<template>
  <div>
<v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-card 
        class="pa-5 ma-2 offer-card" 
        @click="goRoute(route)"
        outlined
        >
    <v-card-title class="p-0 body-1 font-weight-bold "> {{ name }} </v-card-title>
    <v-card-text class="p-0">
      
      <div class="offer-card-chips my-2">
          <v-chip
            class="ma-0" small label
            >
            {{code}}
          </v-chip>
          <v-chip
            class="ma-0 ml-2 color-chip" small label
            >
            {{department}}
          </v-chip>
          
      </div>
      

      <div class="offer-card-info">
        <p class="m-0">Colaboradores: {{users.length}}</p>
      </div>
      
    </v-card-text>
    <v-card-actions class="p-0 mt-2">
      <v-btn
        text small
        v-bind="attrs"
          v-on="on"
        class="offer-card-btn mx-auto btn-block"
        @click="openDialog"
      >
        Más detalles
      </v-btn>
    </v-card-actions>

  </v-card>
      </template>

      <v-card class="project-dialog">
        <v-card-title class="headline grey lighten-2">
          {{name}}
        </v-card-title>

        <v-card-text class="my-2 project-dialog-info pb-0">
            <div>
                <strong>Código: </strong> <p>{{code}}</p>
            </div>
            <div>
                <strong>Departamento: </strong> <p>{{department}}</p>
            </div>
            <div>
                <strong>Líder: </strong> <p>{{leader.name}} {{leader.lastname}}</p>
            </div>
            <div>
                <strong>Status: </strong> <p>{{status}}</p>
            </div>
          
        </v-card-text>
        <v-card-text class="mb-2 pb-0 body-2">
          <p><strong>Total de horas trabajadas: </strong>{{worked_hours}}</p> 
        </v-card-text>
        <v-card-text class="mb-2 pb-0 body-2" v-if="description">
          <p><strong>Descripción: </strong>{{description}}</p> 
        </v-card-text>

        <v-expansion-panels focusable class="px-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Colaboradores ({{users.length}})</v-expansion-panel-header>
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
                                Horas completadas
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(user,u) in users"
                            :key="u"
                            >
                            <td class="text-center">{{ user.name }}</td>
                            <td class="text-center">{{ user.lastname }}</td>
                            <td class="text-center">{{ user.offer_user.roster }}</td>
                            <td class="text-center">{{ user.offer_user.hours_done }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-card-actions>
            <v-btn
            color="red"
            text
            @click="openDelete()"
          >
            Eliminar
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="editOffer()"
          >
            Editar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
        <template>
              <v-dialog v-model="dialogDelete" max-width="400px" class="pa-0">
                <v-card style="display: flex; justify-content: center; flex-direction: column">
                  <v-card-title class="headline text-center mx-auto">¿Seguro que desea eliminar <br> esta oferta?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="simple-btn-back" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn class="simple-btn" text @click="deleteOffer()">Sí, eliminar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </template>
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
    </div>
</template>
<script>
import OfferDataService from "../../services/OfferDataService";
import OfferUserDataService from "../../services/OfferUserDataService";
export default {
  name: "OfferCard",
  props: {
    name: String,
    description: String,
    code: String,
    department: String,
    status: String,
    leader: Object,
    users: Array,
    id: Number,
  },
  data: () => ({
      dialog: false,
      dialogDelete: false,
      offerToDelete: "",
      associations: [
          {
              title: "Colaboradores",
              array: "users"
          }
      ],
      origin_offer_users: [],
      alertSuccess: false,
      successMessage: "Oferta eliminada correctamente. Espere mientras se actualiza.",
      timeout: 4000,
  }),
  computed: {
    worked_hours(){
      let hours = 0;
      this.origin_offer_users.forEach(pu => {
        if (this.id == pu.offer_id){
          pu.load_offers.forEach(load => {
            hours = hours + load.hours;
          });
        }
      });
      return hours;
    },
  },
  methods: {
    goRoute(route) {
      this.$router.push("/" + route);
    },
    openDialog(){
        this.dialog = true;
        console.log(this.id)
    },
    editOffer() {
      let id = this.id;
      this.$router.push({ name: "offers-details", params: { id: id } });
    },
    closeDelete(){
      this.dialogDelete = false;
    },
    openDelete(){
      this.dialogDelete = true;
      this.offerToDelete = this.id;
    },
    deleteOffer() {
      let id = this.offerToDelete;
      OfferDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();
      this.dialog = false;
      this.alertSuccess = true;
      location.reload();
      return false;
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
  },
  mounted() {
    this.retrieveOfferUsers();

  },
};
</script>

<style>
    .offer-card{
        width: 236px;
        max-height: 240px;
        border: 1px solid #00917c  !important;
        padding: 8px;
        background-color:rgb(247, 245, 245) !important;
    }
    .offer-card-info, .project-dialog-info {
        display: flex;
        justify-content: space-between;
    }
    .offer-card-chips {
        display: flex;
        justify-content: flex-start;
    }
    .offer-card-title {
        color: #00917c  !important;
    }
    .color-chip{
        background-color: blanchedalmond !important;
    }
    .offer-card-btn{
        border: 1px solid #00917c !important;
        transition: 0.3s;
        background-color:ghostwhite;
        color: #00917c !important;
    }
    .offer-card-btn:hover{
        background-color: #00917c !important;
        color: white !important;
    }
</style>