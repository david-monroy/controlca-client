<template>
  <div id="navbar">
      <nav class="navbar navbar-expand secondary">
        <div class="container container-navbar">
          <a href class="navbar-brand"
            @click.prevent>Controlca App
          </a>
          <p  v-if="currentUser"
              class="navbar-name ma-0">
              |  {{currentUser.name}} {{currentUser.lastname}}
          </p>
        <div v-if="currentUser" class="ml-auto navbar-nav">
            <v-menu offset-y sytle="background-color: black">
            <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs"
                v-on="on" color="white"> mdi-menu</v-icon>
            </template>
            <v-list class="nav-list">
                <li class="nav-item">
            <router-link to="/dashboard" class="nav-link ">Escritorio</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="showLeaderBoard" to="/project_offer" class="nav-link">Proyectos</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="showAdminBoard" to="/users" class="nav-link">Usuarios</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/loads" class="nav-link">Cargar Horas</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reports" class="nav-link">Reportes</router-link>
          </li>

          <li class="nav-item">
            <a class="nav-link" href @click.prevent="logOut">
              <font-awesome-icon icon="sign-out-alt" />     Cerrar sesión
            </a>
          </li>
            </v-list>
            </v-menu>
        </div>
          
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "navbar-mobile",
  data: () => ({

  }),
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.rol_id == 1) {
        return this.currentUser;
      }
      return false;
    },
    showLeaderBoard() {
      if (this.currentUser && (this.currentUser.rol_id == 2 || this.currentUser.rol_id == 1)) {
        return this.currentUser;
      }

      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/');
    }
  }
}
</script>

<style>
@import "../styles/components/navbar.css";
</style>