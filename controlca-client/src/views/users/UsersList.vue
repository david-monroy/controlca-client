<template>
  <v-row align="center" class="list px-3 mt-2 mx-auto">
    <v-col cols="12" sm="12">
      <v-card class="mx-auto p-3" tile>
        <v-card-title> <span class="primary--text">Usuarios</span>
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
          :items="users"
          :hide-default-footer="false"
          :items-per-page="5"
          :search="search"
        >
          <template v-slot:top>
              <v-dialog v-model="dialogDelete" max-width="700px">
                <v-card>
                  <v-card-title class="body-1 mx-auto">¿Seguro que desea eliminar a {{userToDeleteName}} {{userToDeleteLastname}}?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="secondary--text" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteUser()">Sí, eliminar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
         
              <v-dialog v-model="dialogInfo" max-width="650px">
                <v-card class="project-dialog">
                  <v-card-title class="headline grey lighten-2">
                    {{currentUserInfo.name}} {{currentUserInfo.lastname}}
                  </v-card-title>

                  <v-card-text class="my-2  pb-0" style="display: flex; justify-content: space-between">
                      <div>
                          <strong>Número de empleado: </strong> <p>{{currentUserInfo.carnet}}</p>
                      </div>
                      <div>
                          <strong>Usuario: </strong> <p>{{currentUserInfo.username}}</p>
                      </div>
                      <div>
                          <strong>Permisos: </strong> <p> {{currentUserInfo.rol.name}}</p>
                      </div>
                    
                  </v-card-text>

                  <v-expansion-panels focusable class="px-5 mb-2">
            <v-expansion-panel>
                <v-expansion-panel-header>Proyectos involucrado ({{currentUserInfo.working_projects.length}})</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-if="currentUserInfo.working_projects.length == 0">
                    <p class="my-3">{{currentUserInfo.name}} {{currentUserInfo.lastname}} no está asociado/a a ningún proyecto.</p>
                  </div>
                    <v-simple-table max-height="240px" v-else>
                        <template v-slot:default>
                        <thead >
                            <tr>
                              <th class="text-center">
                                Código
                            </th>
                            <th class="text-center">
                                Nombre
                            </th>
                            <th class="text-center">
                                Nro. de áreas
                            </th>
                            <th class="text-center">
                                Rol
                            </th>
                            <th class="text-center">
                                Estatus
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(working_project,p) in currentUserInfo.working_projects"
                            :key="p"
                            >
                            <td class="text-center">{{ working_project.code }}</td>
                            <td class="text-center">{{ working_project.name }}</td>
                            <td class="text-center">{{ working_project.areas }}</td>
                            <td class="text-center">{{ working_project.project_user.roster }}</td>
                            <td v-if="working_project.project_user.status == true" class="text-center">Activo</td>
                            <td v-else class="text-center red--text">Inactivo</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels focusable class="px-5 mb-2">
            <v-expansion-panel>
                <v-expansion-panel-header>Ofertas involucrado ({{currentUserInfo.working_offers.length}})</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-if="currentUserInfo.working_offers.length == 0">
                    <p class="my-3">{{currentUserInfo.name}} {{currentUserInfo.lastname}} no está asociado/a a ninguna oferta.</p>
                  </div>
                    <v-simple-table max-height="240px" v-else>
                        <template v-slot:default>
                        <thead >
                            <tr>
                              <th class="text-center">
                                Código
                            </th>
                            <th class="text-center">
                                Nombre
                            </th>
                            <th class="text-center">
                                Rol
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(working_offer,p) in currentUserInfo.working_offers"
                            :key="p"
                            >
                            <td class="text-center">{{ working_offer.code }}</td>
                            <td class="text-center">{{ working_offer.name }}</td>
                            <td class="text-center">{{ working_offer.offer_user.roster }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

                  <v-card-actions>
                    <v-btn
                      color="primary"
                      text
                      @click="dialogInfo = false"
                    >
                      Cerrar
                    </v-btn>
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
                @click="openInfo(item.id)" class="mr-2 primary--text">mdi-folder-search</v-icon>
              </template>
              <span>Proyectos</span>
            </v-tooltip>

            <v-tooltip
                top 
                style="display: inline"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on"
                @click="editUser(item.id)" class="mr-2">mdi-pencil</v-icon>
              </template>
              <span>Editar</span>
            </v-tooltip>

            <v-tooltip
                top 
                style="display: inline"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on"
                @click="openDelete(item.id, item.name, item.lastname)" class="red--text">mdi-delete</v-icon>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </template>
        </v-data-table>

      </v-card>
    </v-col>
    <div class="buttons">
      <v-btn class="btn-block w-50 my-2 mx-auto simple-btn d-none d-sm-flex"
      @click="goRoute(addUser)">
        Registrar Usuario
      </v-btn>
      <v-btn class="btn-block w-75 my-2 mx-auto simple-btn  d-flex d-sm-none"
      @click="goRoute(addUser)">
        Registrar Usuario
      </v-btn>
      <v-btn class="btn-block w-25 mx-auto simple-btn-back d-none d-sm-flex" @click="goRoute(goBack)">
        Regresar
      </v-btn>
      <v-btn class="btn-block w-75 mb-3 mx-auto simple-btn-back d-flex d-sm-none" @click="goRoute(goBack)">
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
  </v-row>
</template>

<script>
import UserDataService from "../../services/UserDataService";
import RolDataService from "../../services/RolDataService";

export default {
  name: "users-list",
  data() {
    return {
      users: [],
      rols: [],
      addUser: 'users-add',
      goBack: "dashboard",
      title: "",
      search: "",
      headers: [
        { text: "Nombre", align: "start", sortable: true, value: "name" },
        { text: "Apellido", value: "lastname", sortable: true },
        { text: "Nro. Carnet", value: "carnet", sortable: true },
        { text: "Nombre de usuario", value: "username", sortable: true },
        { text: "Permisos", value: "rol.name", sortable: true },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],

      show_folder: false,

      dialogDelete: false,
      userToDelete: "",

      dialogInfo: false,
      userToInfo: 1,

      userToDeleteName: "",
      userToDeleteLastname: "",

      currentUserInfo: {
        name: "Test",
        lastname: "Test",
        carnet: "Test",
        username: "Test",
        id: 0,
        projects: [],
        offers: [],
        working_projects: [],
        working_offers: [],
        rol: {
          name: "Test"
        }
      },

      // Snackbar
      timeout: 4000,
      alertSuccess: false,
      successMessage: "Usuario eliminado satisfactoriamente."
    };
  },
  // computed: {
  //   currentUserInfo(){
  //     let currentUser = 1;
  //     this.users.forEach(user => {
  //       if (user.id == this.userToInfo){
  //         currentUser = user;
  //       }
  //     });
  //     return currentUser;
  //   }
  // },
  watch: {
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
  methods: {

    retrieveUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveUsers();
    },

    removeAllUsers() {
      UserDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      UserDataService.findByTitle(this.title)
        .then((response) => {
          this.users = response.data.map(this.getDisplayUser);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editUser(id) {
      this.$router.push({ name: "users-details", params: { id: id } });
    },

    deleteUser() {
      let id = this.userToDelete;
      UserDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();
      this.alertSuccess = true;
    },

    getDisplayUser(user) {
      return {
        id: user.id,
        name: user.name.length > 30 ? user.name.substr(0, 30) + "..." : user.name,
        lastname: user.lastname.length > 30 ? user.lastname.substr(0, 30) + "..." : user.lastname,
        username: user.username.length > 30 ? user.username.substr(0, 30) + "..." : user.username,
        rol: user.rol,
        carnet: user.carnet.length > 30 ? user.carnet.substr(0, 30) + "..." : user.carnet
      };
    },

    closeDelete(){
      this.dialogDelete = false;
    },
    openDelete(userID, userName, userLastname){
      this.dialogDelete = true;
      this.userToDelete = userID;
      this.userToDeleteName = userName;
      this.userToDeleteLastname = userLastname;
    },

    openInfo(userID){
      this.dialogInfo = true;
      this.userToInfo = userID;
      this.users.forEach(user => {
        if (user.id == this.userToInfo){
          this.currentUserInfo = user;
        }
      });
    },

    goRoute(route) {
      this.$router.push("/" + route);
    },
    retrieveRols() {
      RolDataService.getAll()
        .then((response) => {
          this.rols = response.data.map(this.getDisplayRol);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getDisplayRol(rol) {
      return {
        id: rol.id,
        name: rol.name.length > 30 ? rol.name.substr(0, 30) + "..." : rol.name
      };
    },

  },
  mounted() {
    this.retrieveUsers();
    this.retrieveRols();
  },
};
</script>

<style>
  .list {
    max-width: 750px;
  }
</style>