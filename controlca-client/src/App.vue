<template>
  <v-app>
    <div id="id">
      <navbar id="navbar"></navbar>
      <navbar-mobile id="navbar-mobile"></navbar-mobile>
      <div class="container">
        <router-view />
      </div>
    </div>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import NavbarMobile from "./components/NavbarMobile.vue";
export default {
  name: "app",
  components: { Navbar, NavbarMobile }
};
</script>

<style>
@import "./styles/main.css";
  @media only screen and (max-width: 1000px) {
    #navbar{
      display: none
  }
  }
  @media only screen and (min-width: 1000px) {
    #navbar-mobile{
      display: none
  }
  }
</style>