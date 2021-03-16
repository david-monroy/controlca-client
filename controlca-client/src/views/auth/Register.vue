<template>
  <div class="col-md-12 mt-3 pt-1">
    <div class="card card-container mt-0 form-card">
      <form name="registryForm" 
      v-on="handleRegister.prevent"
      >
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="6" cols="12" class="py-0">
              <div class="form-group">
                <label for="name">Nombre</label>
                <input
                  v-model="user.name"
                  v-validate="'required|min:3|max:20'"
                  type="text"
                  class="form-control"
                  name="name"
                />
                <div
                  v-if="submitted && errors.has('name')"
                  class="alert-danger"
                >{{errors.first('name')}}</div>
              </div>
              </v-col>
              <v-col md="6" cols="12" class="py-0">
              <div class="form-group">
                <label for="lastname">Apellido</label>
                <input
                  v-model="user.lastname"
                  v-validate="'required|min:3|max:20'"
                  type="text"
                  class="form-control"
                  name="lastname"
                />
                <div
                  v-if="submitted && errors.has('lastname')"
                  class="alert-danger"
                >{{errors.first('lastname')}}</div>
              </div>
            </v-col>
          </v-row>
          <v-row class="pb-0 mb-0 form-row">
            <v-col md="6" cols="12" class="py-0">
              <div class="form-group">
              <label for="carnet">Número de carnet</label>
              <input
                v-model="user.carnet"
                v-validate="'required|min:3|max:20'"
                type="text"
                class="form-control"
                name="carnet"
              />
              <div
                v-if="submitted && errors.has('carnet')"
                class="alert-danger"
              >{{errors.first('carnet')}}</div>
            </div>
            </v-col>

            <v-col md="6" cols="12" class="py-0">
              <label for="username">Nombre de usuario</label>
              <input
                v-model="user.username"
                v-validate="'required|max:50'"
                type="text"
                class="form-control"
                name="username"
              />
              <div
                v-if="submitted && errors.has('username')"
                class="alert-danger"
              >{{errors.first('username')}}
              </div>

            </v-col>
          </v-row>
          <v-row class="pb-0 mb-0 form-row-rol">
            <div class="form-group">
              <v-select
                  v-model="user.rol"
                  class="mt-8"
                  :items="rols"
                  label="Rol"       
                  :placeholder="rols[0].name"
                  outlined
                  item-text="name"
                  item-value="id"
                  dense
                  required   
                  ></v-select>
            </div>
          </v-row>
                   
          <v-row class="pb-0 mb-0 form-row">
            <v-col md="6" cols="12" class="py-0">
              <div class="form-group">
                <v-text-field
                  v-model="user.password"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  v-validate="'required|min:6|max:40'"
                  label="Contraseña"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
                  name="password"
                ></v-text-field>
                <div
                  v-if="submitted && errors.has('password')"
                  class="alert-danger"
                >{{errors.first('password')}}</div>
              </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
              <div class="form-group">
                <v-text-field
                  v-model="confirmPassword"
                  :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                  v-validate="'required|min:6|max:40'"
                  label="Confirmar contraseña"
                  :type="showConfirm ? 'text' : 'password'"
                  @click:append="showConfirm = !showConfirm"
                  name="confirmPassword"
                ></v-text-field>
                <div
                  v-if="submitted && errors.has('password')"
                  class="alert-danger"
                >{{errors.first('password')}}</div>
              </div>
            </v-col>
          </v-row>
          
          <div class="form-group mt-4">
            <button class="btn btn-primary btn-block"
                @click="handleRegister()"
                :loading="loading">
                Registrar
            </button>
          </div>

      </form>

      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >{{message}}</div>
    </div>
    <v-snackbar
          v-model="alertError"
          type="error"
          top
          :timeout="timeout"
          color="error"
        >
          <strong class="body-1 registry-snackbar font-weight-bold">
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
</template>

<script>

import RolDataService from "../../services/RolDataService";

export default {
  name: 'register',
  data: () => ({
      user: {
        name: null,
        lastname: null,
        username: this.name + "." + this.username,
        password: null,
        rol: null,
        carnet: null,
      },
      confirmPassword: null,
      submitted: false,
      message: '',
      show: false,
      showConfirm: false,
      rols: [],
      rolsDisabled: false,
      loading: false,

      // Snackbar
      timeout: 4000,
      alertError: false,
      errorMessage: "Las contraseñas no coinciden."
  }),

  methods: {
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
    async handleRegister() {
      if (this.matchPassword()){
        this.loading = true,
        this.message = '';
        this.submitted = true;
        this.$validator.validate().then(isValid => {
          if (isValid) {
            this.$store.dispatch('auth/register', this.user);
          }
          this.$router.push("/users");
        });
      } else {
        this.alertError = true;
      }
    },
    matchPassword(){
      return (this.user.password == this.confirmPassword)
    },
    goRoute(route) {
      this.$router.push("/" + route);
    },
  },
  mounted() {
    this.retrieveRols();
  },
};
</script>

<style scoped>

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

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.form-group{
  margin-bottom: 8px !important;
}

.form-row-rol .form-group{
  max-height: 60px;
  margin-bottom: 50px;
}

</style>