<template>
  <div id="app">
    <navbar></navbar>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  name: "app",
  components: { Navbar }
};
</script>

<style>
  #app{
    background-color: blanchedalmond;
    min-height: 600px;
  }
</style>