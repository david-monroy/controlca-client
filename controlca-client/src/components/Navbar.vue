<template>
  <div id="navbar">
      <nav class="navbar navbar-expand navbar-dark bg-dark">
          <div class="container container-navbar">
      <a href class="navbar-brand" @click.prevent>Controlca App</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" />Home
          </router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/" class="nav-link">Admin Board</router-link>
        </li>
        <li v-if="showLeaderBoard" class="nav-item">
          <router-link to="/" class="nav-link">Leader Board</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="currentUser" to="/" class="nav-link">User</router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" />Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" />Login
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
             {{ currentUser.name }} {{ currentUser.lastname }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" />LogOut
          </a>
        </li>
      </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
    name: "navbar",
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.rol == 1) {
        return this.currentUser;
      }

      return false;
    },
    showLeaderBoard() {
      if (this.currentUser && this.currentUser.rol == 2) {
        return this.currentUser.rol;
      }

      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
}
</script>

<style>
    .container-navbar{
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }
</style>