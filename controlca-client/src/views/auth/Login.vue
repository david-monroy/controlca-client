<template>
  <div class="col-md-12">
    <div class="login-card login-card-container rounded-card">
      <div class="w-100">
        <img src="../../assets/logo-controlca.png" alt="Logo Controlca" class="login-logo ma-0">
        <p class="mb-0 primary--text text-center">[ Control Interno ]</p>
        <v-divider class="w-75 my-4 mx-auto"></v-divider>
      </div>
      
      <form name="form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Nombre de usuario</label>
          <input
            v-model="user.username"
            v-validate="'required'"
            type="text"
            class="form-control"
            name="username"
          />

        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            v-model="user.password"
            v-validate="'required'"
            class="form-control"
            name="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
          />
        </div>
        <div class="form-group">
          <button class="btn simple-btn btn-block" :disabled="loading">
            <span v-show="loading" class="spinner-border spinner-border-sm mr-2"></span>
            <span>Ingresar</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">{{message.message}}</div>
        </div>
        <div class="form-group">
          <div v-if="completeFields" class="alert alert-danger" role="alert">Por favor, complete los campos.</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import User from '../../models/user';

export default {
  name: 'Login',
  data() {
    return {
      user: new User('', ''),
      loading: false,
      message: '',
      show: false,
      completeFields: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.completeFields = false;
      // this.$validator.validateAll().then(isValid => {
      //   if (!isValid) {
      //     this.loading = false;
      //     return;
      //   }

        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/');
            },
            error => {
              this.loading = false;
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
        } else {
          this.loading = false;
          this.completeFields = true;
        }
      // });
    }
  }
};
</script>

<style>
@import "../../styles/components/login.css";
</style>