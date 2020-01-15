<template>
  <div class="home">
    <v-row align="center" justify="center">
      <transition name="fade">
        <v-img
          src="../../public/bp-logo-circle2.png"
          aspect-ratio="1"
          class="my-10"
          max-width="600"
          max-height="600"
        ></v-img>
      </transition>
    </v-row>
    <v-row align="center" justify="center">
      <div v-if="!loggedIn">
        <h2>
          <router-link to="/login">LOGIN</router-link> |
          <router-link to="/register">REGISTER</router-link>
        </h2>
      </div>
      <div v-else>
        <h2>Welcome back!</h2>
      </div>
    </v-row>
  </div>
</template>

<script>
import { authComputed } from '../store/helpers.js'

export default {
  computed: {
    ...authComputed
  }
}
</script>
