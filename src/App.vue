<template>
  <v-app
    style="
    background: #943D1E;
  "
  >
    <v-app-bar app color="#3D0C11" dark>
      <v-toolbar-title>
        <v-img
          src="../public/bp-logo-small.png"
          max-width="250"
          max-height="70"
        ></v-img
      ></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-for="link in links"
        :key="`${link.label}-header-link`"
        color="#F27C3D"
        text
        rounded
        :to="link.url"
      >
        {{ link.label }}
      </v-btn>
      <v-btn v-if="loggedIn" variant="primary" @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer color="#3D0C11">
      <v-layout justify-center wrap color="#F27C3D">
        <v-flex py-3 color="#F27C3D" text-center>
          ©{{ new Date().getFullYear() }} — <strong>AleTek & PonRed</strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import { authComputed } from './store/helpers.js'

export default {
  computed: {
    ...authComputed
  },
  name: 'App',
  data() {
    return {
      links: [
        {
          label: 'Home',
          url: '/'
        },
        {
          label: 'Login',
          url: '/login'
        },
        {
          label: 'Dashboard',
          url: '/dashboard'
        },
        {
          label: 'Expenses',
          url: '/expenses'
        },
        {
          label: 'Savings',
          url: '/savings'
        },
        {
          label: 'Incomes',
          url: '/incomes'
        }
      ]
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
