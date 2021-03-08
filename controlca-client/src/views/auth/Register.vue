<template>
  <div class="col-md-12 mt-3 pt-1">
    <div class="card card-container mt-0 form-card">
      <form name="form" v-on="handleRegister.prevent">
        <div v-if="!successful">
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="6" cols="12">
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
              <v-col md="6" cols="12">
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
            <v-col md="6" cols="12">
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

            <v-col md="6" cols="12">
              <div class="form-group">
                <v-select
                v-model="user.rol"
                :items="rols"
                label="Rol"       
                :placeholder="rols[0].name"
                outlined
                item-text="name"
                item-value="id"
                required   
                ></v-select>
              </div>
            </v-col>
          </v-row>
          
                   
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              v-model="user.email"
              v-validate="'required|email|max:50'"
              type="email"
              class="form-control"
              name="email"
            />
            <div
              v-if="submitted && errors.has('email')"
              class="alert-danger"
            >{{errors.first('email')}}</div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="user.password"
              v-validate="'required|min:6|max:40'"
              type="password"
              class="form-control"
              name="password"
            />
            <div
              v-if="submitted && errors.has('password')"
              class="alert-danger"
            >{{errors.first('password')}}</div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block"  @click="handleRegister()">Registrar</button>
          </div>
        </div>
      </form>

      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >{{message}}</div>
    </div>
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
        email: null,
        password: null,
        rol: null,
        carnet: null,
      },
      rrr: [
        "Hola", "Nojjoda", "Chao"
      ],
      submitted: false,
      successful: false,
      message: '',
      rols: [],
      rolsDisabled: false
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
      this.message = '';
      this.submitted = true;
      console.log(this.user);
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            data => {
              this.message = data.message;
              this.successful = true;
            },
            error => {
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.successful = false;
            }
          );
        }
      });
    }
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

</style>