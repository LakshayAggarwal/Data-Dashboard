<template>
  <v-app>
    <v-layout class="top-navigation">
      <v-flex align-self-center ml-6 class="navigation-heading text-left">
        Dashboard
      </v-flex>
    </v-layout>
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
  font-family: 'Roboto Mono', monospace !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
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

.top-navigation {
  height: 64px;
  box-shadow: 0px 9px 11px 0px  rgba(0,0,0,0.4);
}

.navigation-heading {
  font-size: 34px;
  font-weight: bold;
}

</style>
