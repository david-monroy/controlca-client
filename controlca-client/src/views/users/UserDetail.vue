<template>
  <div v-if="currentUser" class="edit-form py-3">
    <div class="col-md-12 mt-3 pt-1">
    <div class="card card-container mt-0 form-card">
      <p class="headline">Editar usuario</p>
      <v-form
        ref="updateForm"
        v-model="valid"
        lazy-validation
      >
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="currentUser.name"
                        :rules="nameRules"
                        label="Name"
                        required
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="currentUser.lastname"
                        :rules="lastnameRules"
                        label="Apellido"
                        name="lastname"
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>

          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="currentUser.carnet"
                        :rules="carnetRules"
                        label="Número de carnet"
                        name="carnet"
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="currentUser.email"
                        :rules="emailRules"
                        label="Correo electrónico"
                        name="email"
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>

          <v-row class="pb-0 mb-0 form-row-rol">
            <div class="form-group">
              <v-select
                v-model="currentUser.rol"
                :items="rols"
                :rules="[v => !!v || 'El rol es obligatorio']"
                label="Rol"
                :placeholder="rols[0].name"
                item-text="name"
                item-value="id"
                outlined
                dense
                required
              ></v-select>
            </div>
          </v-row>

            <v-btn @click="updateUser"
                :disabled="!valid"
                class="btn btn-success btn-block w-50 my-2 mx-auto simple-btn">
                Guardar Cambios
            </v-btn>
            <v-btn @click="goRoute(back)"
                class="btn-block w-25 mx-auto simple-btn-back">
                Regresar
            </v-btn>
      </v-form>
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
  </div>
  </div>
  <div v-else>
    <p>Cargando...</p>
  </div>
</template>

<script>
import UserDataService from "../../services/UserDataService";
import RolDataService from "../../services/RolDataService";

export default {
  name: "user-detail",
  data: () => ({
      user: {
        name: null,
        lastname: null,
        email: null,
        carnet: null,
        password: null,
        rol: null
      },
      rols: [],
      submitted: false,
      confirmPassword: null,
      show: false,
      showConfirm: false,
      back: 'users',
      valid: true,

      currentUser: null,

      // Rules
      nameRules: [
        v => !!v || 'El nombre es obligatorio'
      ],
      lastnameRules: [
        v => !!v || 'El apellido es obligatorio'
      ],
      carnetRules: [
        v => !!v || 'El carnet es obligatorio'
      ],
      emailRules: [
        v => !!v || 'El correo es obligatorio'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es obligatoria',
        v => (v && v.length >= 6) || 'Debe tener al menos 6 caracteres',
      ],

      // Snackbar
      timeout: 4000,
      alertSuccess: false,
      successMessage: "Usuario registrado satisfactoriamente.",
      alertError: false,
      errorMessage: null,
  }),
  methods: {
    goRoute(route) {
      this.$router.push("/" + route);
    },
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

      let validatedForm = this.$refs.updateForm.validate();
      if (validatedForm) {
        UserDataService.update(this.currentUser.id, this.currentUser)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
        this.alertSuccess = true;
        this.successMessage = "Usuario actualizado correctamente";
      } else {
        this.alertError = true;
        this. errorMessage = "Por favor, revise los campos.";
      }
      
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
    this.message = "";
    this.getUser(this.$route.params.id);
    this.retrieveRols();
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