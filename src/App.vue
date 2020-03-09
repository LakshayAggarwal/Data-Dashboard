<template>
  <v-app>
    <dashboard />
  </v-app>
</template>

<script>
import dashboard from './components/dashboard.vue';

export default {
  name: 'App',
  components: {
    dashboard,
  },
};
</script>

<style>
#app {
  font-family: 'Roboto Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
::-webkit-scrollbar {
  width: 14px;
}
::-webkit-scrollbar-thumb {
  border-radius: 12px;
  background-color: #c2c2c2;
  border: 3px solid transparent;
  background-clip: content-box;
}
</style>
