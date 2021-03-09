<template>
  <div class="col-md-12 mt-3 pt-1">
    <div class="card card-container mt-0 form-card">
      <div class="submit-form">
        <div v-if="!submitted">
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="user.name"
                        v-validate="'required|max:40'"
                        label="Nombre"
                        name="name"
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="user.lastname"
                        v-validate="'required|max:40'"
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
                        v-model="user.carnet"
                        v-validate="'required|min:2|max:40'"
                        label="Número de carnet"
                        name="carnet"
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="user.email"
                        v-validate="'required|max:40'"
                        label="Correo electrónico"
                        name="email"
                    ></v-text-field>
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

        <button @click="saveUser" class="btn btn-success btn-block w-50 mx-auto">Registrar</button>
        </div>
        </div>
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
  </div>
</template>

<script>
import UserDataService from "../../services/UserDataService";
import RolDataService from "../../services/RolDataService";

export default {
  name: "users-add",
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

      // Snackbar
      timeout: 4000,
      alertSuccess: false,
      successMessage: "Usuario registrado satisfactoriamente."
  }),
  methods: {
    saveUser() {
      var data = {
        name: this.user.name,
        lastname: this.user.lastname,
        email: this.user.email,
        carnet: this.user.carnet,
        rol: this.user.rol,
        password: this.user.password
      };

      if (this.matchPassword()){
        UserDataService.create(data)
            .then(response => {
            this.user.id = response.data.id;
            console.log(response.data);
            this.submitted = true;
            })
            .catch(e => {
            console.log(e);
            });
        this.alertSuccess = true;
        this.goRoute("users");
        }
    },

    goRoute(route) {
      this.$router.push("/" + route);
    },
    
    newUser() {
      this.submitted = false;
      this.user = {};
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
    matchPassword(){
      return (this.user.password == this.confirmPassword)
    },
  },
  mounted() {
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