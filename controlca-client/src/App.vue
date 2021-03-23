<template>
  <v-app>
    <div id="id">
      <navbar></navbar>
      <div class="container">
        <router-view />
      </div>
    </div>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  name: "app",
  components: { Navbar }
};
</script>

<style>
@import "./styles/main.css";
</style>