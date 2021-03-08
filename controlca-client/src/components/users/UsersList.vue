<template>
  <v-row align="center" class="list px-3 mt-5 mx-auto">
        <v-col cols="12" sm="12">
      <v-card class="mx-auto p-3" tile>
        <v-card-title>Usuarios</v-card-title>
        
        <v-data-table
          :headers="headers"
          :items="users"
          disable-pagination
          :hide-default-footer="true"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editUser(item.id)">mdi-pencil</v-icon>
            <v-icon small @click="deleteUser(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>

      </v-card>
    </v-col>
    <v-btn class="simple-btn my-2 mx-auto" @click="goRoute(addUser)">
      Registrar Usuario
    </v-btn>
  </v-row>
</template>

<script>
import UserDataService from "../../services/UserDataService";
export default {
  name: "users-list",
  data() {
    return {
      users: [],
      addUser: 'users-add',
      title: "",
      headers: [
        { text: "Nombre", align: "start", sortable: true, value: "name" },
        { text: "Apellido", value: "lastname", sortable: true },
        { text: "Nro. Carnet", value: "carnet", sortable: true },
        { text: "Correo electrónico", value: "email", sortable: true },
        { text: "Rol", value: "rol", sortable: true }
      ],
    };
  },
  methods: {
    retrieveUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.users = response.data.map(this.getDisplayUser);
          console.log(response.data);
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

    deleteUser(id) {
      UserDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayUser(user) {
      return {
        id: user.id,
        name: user.name.length > 30 ? user.name.substr(0, 30) + "..." : user.name,
        lastname: user.lastname.length > 30 ? user.lastname.substr(0, 30) + "..." : user.lastname,
        email: user.email.length > 30 ? user.email.substr(0, 30) + "..." : user.email,
        rol: user.rol.length > 30 ? user.rol.substr(0, 30) + "..." : user.rol,
        carnet: user.carnet.length > 30 ? user.carnet.substr(0, 30) + "..." : user.carnet
      };
    },

    goRoute(route) {
      this.$router.push("/" + route);
    },
  },
  mounted() {
    this.retrieveUsers();
  },
};
</script>

<style>
  .list {
    max-width: 750px;
  }
  
  .simple-btn{
    width: 35%;
    background-color: #00917c !important;
    transition: 0.3s;
    color: white !important;
  }
  .simple-btn:hover{
    width: 35%;
    background-color: #066B5D !important;
  }
</style>