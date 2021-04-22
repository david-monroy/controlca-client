<template>
  <div class="col-md-12 mt-3 pt-1">
    <div class="card card-container mt-0 form-card">
      <h3 class="primary--text mx-auto mb-3 mt-0">Registrar nuevo usuario</h3>
      <v-spacer></v-spacer>
  
      <v-form
        ref="registerForm"
        v-model="valid"
        lazy-validation
      >
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="user.name"
                        :rules="nameRules"
                        label="Nombre"
                        required
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="user.lastname"
                        :rules="lastnameRules"
                        label="Apellido"
                        name="lastname"
                        required
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>

          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="user.carnet"
                        :rules="carnetRules"
                        label="Número de empleado"
                        name="carnet"
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="username"
                        :rules="usernameRules"
                        label="Nombre de usuario"
                        name="username"
                        readonly
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>

          <v-row class="pb-0 mb-0 form-row-rol">
            <div class="form-group">
              <v-select
                v-model="user.rol_id"
                :items="rols"
                :rules="[v => !!v || 'Campo obligatorio']"
                label="Permisos"
                :placeholder="rols[0].name"
                item-text="name"
                item-value="id"
                outlined
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
                  :rules="passwordRules"
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
                  :rules="passwordRules"
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

            <v-btn @click="saveUser"
                :disabled="!valid"
                class="btn btn-success btn-block w-50 my-2 mx-auto simple-btn">
                Registrar
            </v-btn>
            <v-btn @click="goRoute(back)"
                class="btn-block w-25 mx-auto simple-btn-back mb-0">
                Regresar
            </v-btn>
      </v-form>
    </div>

              <v-dialog v-model="userDialog" max-width="500px">
                <v-card class="pa-10 pb-2">
                    <div class="mx-auto pb-2">
                        <p class="primary--text text-center">El nombre de usuario 
                          {{this.user.name.toLowerCase()}}.{{this.user.lastname.toLowerCase()}} 
                          ya está registrado.</p>
                        <p>Por favor, ingrese un segundo apellido para diferenciarlo.</p>
                    </div>
                    <div>
                    
                        <v-row class="pb-0 mb-0 form-row" >

                            <v-col md="6" cols="12" class="py-0">
                                <v-text-field
                                    v-model="second_lastname"
                                    label="Segundo apellido"
                                    name="second_lastname"
                                ></v-text-field>
                            </v-col>
                            <v-col md="6" cols="12" class="py-0">
                                <v-text-field
                                    v-model="username"
                                    label="Nuevo nombre de usuario"
                                    name="username"
                                    readonly
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </div>   
                    <v-btn class="simple-btn mt-2 mx-auto btn-block w-75" @click="saveUser()">
                        Registrar
                    </v-btn>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="secondary--text" text @click="cancelUser()">Cancelar</v-btn>
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
  </div>
</template>

<script>
import UserDataService from "../../services/UserDataService";
import RolDataService from "../../services/RolDataService";

export default {
  name: "users-add",
  data: () => ({
      user: {
        name: "",
        lastname: "",
        carnet: null,
        password: null,
        rol_id: "",
      },
      rols: [],
      submitted: false,
      confirmPassword: null,
      show: false,
      showConfirm: false,
      back: 'users',
      valid: true,

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
      usernameRules: [
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

      origin_users: [],
      second_lastname: null,
      userDialog: false,
  }),
  computed: {
    username: function(){
      let un;
      if (this.second_lastname){
        un = this.user.name + "." + this.user.lastname + "." + this.second_lastname;
      } else {
        un = this.user.name + "." + this.user.lastname;
      }
      return un.toLowerCase();
    }
  },
  methods: {
    cancelUser(){
      this.userDialog = false;
      this.second_lastname = null;
    },
    saveUser() {
      var data = {
        name: this.user.name,
        lastname: this.user.lastname,
        username: this.username,
        carnet: this.user.carnet,
        rol_id: this.user.rol_id,
        password: this.user.password
      };

      let validatedForm = this.$refs.registerForm.validate();

      let itExists = false;
      this.origin_users.forEach(user => {
        if (user.username == data.username) {
          itExists = true;
        }
      });

      if (itExists){
        this.userDialog = true;
      } else {
        if (this.matchPassword()){
          if (validatedForm){
            UserDataService.create(data)
                .then(response => {
                this.user.id = response.data.id;
                console.log(response.data);
                this.submitted = true;
                })
                .catch(e => {
                console.log(e);
                });
            this.successMessage = "Usuario registrado exitosamente.";
            this.alertSuccess = true;
            
            this.userDialog = false;
            this.reset();
          }else{
            this.alertError = true;
            this.errorMessage = "Por favor, revise los campos.";
          }
        } else {
            this.alertError = true;
            this. errorMessage = "¡Las contraseñas no coinciden!";
        }
      }
    },

    goRoute(route) {
      this.$router.push("/" + route);
    },
    
    newUser() {
      this.submitted = false;
      this.user = {};
    },
    retrieveUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.origin_users = response.data;
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
    matchPassword(){
      return (this.user.password == this.confirmPassword)
    },
    reset() {
        this.$refs.registerForm.reset()
      },
  },
  mounted() {
    this.retrieveRols();
    this.retrieveUsers();
  },
};
</script>

<style>
.card-container.card {
  max-width: 650px !important;
  padding: 30px 30px;
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