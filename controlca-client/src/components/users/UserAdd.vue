<template>
  <v-card class="mx-auto main-card">
    <div class="submit-form mt-3 mx-auto">
    <h3 class="headline">Registrar Usuario</h3>

    <div v-if="!submitted">
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="user.name"
          :rules="[(v) => !!v || 'El nombre es requerido']"
          label="Nombre"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.lastname"
          :rules="[(v) => !!v || 'El apellido es requerido']"
          label="Apellido"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.email"
          :rules="[(v) => !!v || 'El correo es requerido']"
          label="Correo electrónico"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.carnet"
          :rules="[(v) => !!v || 'El número de carnet es requerido']"
          label="Número de carnet"
          required
        ></v-text-field>
      </v-form>

      <v-btn color="primary" class="mt-3 simple-btn" @click="saveUser">Registrar</v-btn>
    </div>

    <div v-else>
      <v-card class="mx-auto">
        <v-card-title>
          ¡Registrado correctamente!
        </v-card-title>

        <v-card-subtitle>
          Haz click en el botón para registrar un nuevo usuario.
        </v-card-subtitle>

        <v-card-actions>
          <v-btn color="success" @click="newUser">Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
  </v-card>
</template>

<script>
import UserDataService from "../../services/UserDataService";

export default {
  name: "add-user",
  data() {
    return {
      user: {
        id: null,
        name: "",
        lastname: "",
        email: "",
        carnet: "" 
      },
      submitted: false,
    };
  },
  methods: {
    saveUser() {
      var data = {
        name: this.user.name,
        lastname: this.user.lastname,
        email: this.user.email,
        carnet: this.user.carnet,
      };

      UserDataService.create(data)
        .then((response) => {
          this.user.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newUser() {
      this.submitted = false;
      this.user = {};
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
}
</style>