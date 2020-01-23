<template>
  <v-app>
    <v-app-bar app color="#3D0C11" dark>
      <v-toolbar-title>
        <v-img
          src="../public/bp-logo-small.png"
          max-width="250"
          max-height="70"
        ></v-img
      ></v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="loggedIn">
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
      </div>
      <v-btn v-if="loggedIn" color="#F27C3D" rounded @click="logout"
        >Logout</v-btn
      >
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer color="#3D0C11">
      <v-layout justify-center wrap color="#F27C3D">
        <v-flex py-1 text-center>
          <p style="color: #F27C3D;">
            ©{{ new Date().getFullYear() }} — <strong>AleTek & PonRed</strong>
          </p>
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
          label: 'Dashboard',
          url: '/dashboard'
        },
        {
          label: 'Incomes',
          url: '/incomes'
        },
        {
          label: 'Expenses',
          url: '/expenses'
        },
        {
          label: 'Savings',
          url: '/savings'
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
