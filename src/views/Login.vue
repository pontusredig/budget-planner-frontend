<template>
  <div align="center">
    <v-row align="center" justify="center">
      <v-card width="400" class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h1 class="display-1">Login</h1>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="login">
            <v-text-field
              label="Email"
              prepend-icon="mdi-account-circle"
              v-model="username"
              type="username"
              name="username"
              value
            />
            <v-text-field
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              v-model="password"
              name="password"
            />
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="success" to="/register">Register</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="info" @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <p style="color:red">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      error: null,
      errorMessage: null
    }
  },
  methods: {
    login() {
      this.$store
        .dispatch('login', {
          username: this.username,
          password: this.password
        })
        .then(() => {
          this.$router.push({ name: 'dashboard' })
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.errorMessage = 'Login failed: Invalid username or password.'
          }
          this.log(error.response.data)
        })
    },
    register() {
      axios
        .post('/api/users/register', {
          email: this.username,
          password: this.password
        })
        .then(response => {
          this.message = response.data
          alert(this.message)
        })
        .catch(error => {
          this.log(error)
        })
        .finally(() => this.$router.push({ name: 'login' }))
    },
    log(obj) {
      let parsedObject = JSON.parse(JSON.stringify(obj))
      // eslint-disable-next-line no-console
      console.log(parsedObject)
    }
  }
}
</script>
