<template>
  <v-row align="center" class="list px-3 mt-2 mx-auto">
    <v-col cols="12" sm="12">
      <v-card class="mx-auto p-3" tile>
        <v-card-title>Usuarios
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
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="headline">¿Seguro que desea eliminar este usuario?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteUser()">Sí, eliminar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editUser(item.id)">mdi-pencil</v-icon>
            <v-icon small @click="openDelete(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>

      </v-card>
    </v-col>
    <v-btn class="simple-btn mt-2 mb-4 mx-auto" @click="goRoute(addUser)">
      Registrar Usuario
    </v-btn>
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

      dialogDelete: false,
      userToDelete: "",

      // Snackbar
      timeout: 4000,
      alertSuccess: false,
      successMessage: "Usuario eliminado satisfactoriamente."
    };
  },
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
    openDelete(userID){
      this.dialogDelete = true;
      this.userToDelete = userID;
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