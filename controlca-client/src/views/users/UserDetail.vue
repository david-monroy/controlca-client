<template>
  <div v-if="currentUser" class="edit-form py-3">
    <div class="col-md-12 mt-3 pt-1">
    <div class="card card-container mt-0 form-card">
    <p class="headline">Editar usuario</p>

    <v-form ref="form" lazy-validation>
      <v-text-field
        v-model="currentUser.name"
        :rules="[(v) => !!v || 'El nombre es obligatorio']"
        label="Nombre"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentUser.lastname"
        :rules="[(v) => !!v || 'El apellido es obligatorio']"
        label="Apellido"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentUser.carnet"
        :rules="[(v) => !!v || 'El nro. de carnet es obligatorio']"
        label="Nro. de Carnet"
        required
      ></v-text-field>

      <v-divider class="my-5"></v-divider>

      <v-btn color="error" small class="mr-2" @click="deleteUser">
        Eliminar
      </v-btn>

      <v-btn color="success" small @click="updateUser">
        Guardar cambios
      </v-btn>
    </v-form>

    <p class="mt-3">{{ message }}</p>
    </div>
    </div>
  </div>

  <div v-else>
    <p>Selecciona un usuario...</p>
  </div>
</template>

<script>
import UserDataService from "../../services/UserDataService";

export default {
  name: "user",
  data() {
    return {
      currentUser: null,
      message: "",
    };
  },
  methods: {
    getUser(id) {
      UserDataService.get(id)
        .then((response) => {
          this.currentUser = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateUser() {
      UserDataService.update(this.currentUser.id, this.currentUser)
        .then((response) => {
          console.log(response.data);
          this.message = "Usuario actualizado correctamente";
        })
        .catch((e) => {
          console.log(e);
        });
    },

    deleteUser() {
      UserDataService.delete(this.currentUser.id)
        .then((response) => {
          console.log(response.data);
          this.$router.push({ name: "users" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.message = "";
    this.getUser(this.$route.params.id);
  },
};
</script>

<style>
.card-container.card {
  max-width: 650px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
</style>