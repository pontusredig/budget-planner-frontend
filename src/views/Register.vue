/* eslint-disable no-console */
<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col>
        <h1>Register</h1>
        <v-form ref="signUpForm" v-model="formValidity">
          <v-text-field
            label="Email"
            type="email"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>

          <v-text-field
            label="Name"
            type="name"
            v-model="name"
            required
          ></v-text-field>

          <v-text-field
            label="Password"
            type="password"
            v-model="password"
            required
          ></v-text-field>

          <v-text-field
            label="Re-enter password"
            type="password"
            v-model="matchingPassword"
            required
          ></v-text-field>
          <p>
            <strong>Terms & conditions:</strong> <br />
            BudgetPlanner takes no responsibility for your finances or spending
            habits.
          </p>
          <v-checkbox
            label="Agree to terms & conditions"
            v-model="agreeToTerms"
            :rules="agreeToTermsRules"
            required
          ></v-checkbox>
          <v-btn
            @click="register"
            color="primary"
            class="mr-4"
            :disabled="!formValidity"
            >Submit</v-btn
          >
          <v-btn color="error" @click="resetForm">Reset</v-btn>
        </v-form>
        <p>{{ error }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    agreeToTerms: false,
    agreeToTermsRules: [
      value =>
        !!value ||
        'You must agree to the terms and conditions to sign up for an account.'
    ],
    name: '',
    password: '',
    matchingPassword: '',
    message: '',
    error: null,
    email: '',
    emailRules: [
      value => !!value || 'Email is required.',
      value => value.indexOf('@') !== 0 || 'Email should have a username.',
      value => value.includes('@') || 'Email should include an @ symbol.',
      value =>
        value.indexOf('.') - value.indexOf('@') > 1 ||
        'Email should contain a valid domain.',
      value => value.includes('.') || 'Email should include a period symbol.',
      value =>
        value.indexOf('.') <= value.length - 3 ||
        'Email should contain a valid domain extension.'
    ],
    formValidity: false
  }),
  methods: {
    resetForm() {
      this.$refs.signUpForm.reset()
    },
    register() {
      axios
        .post('/api/users/register', {
          email: this.email,
          password: this.password
          //  matchingPassword: this.matchingPassword
        })
        .then(response => {
          this.message = response.data
          alert(this.message)
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          this.errored = true
        })
        .finally(() => this.$router.push({ name: 'login' }))
    }
  }
}
</script>
