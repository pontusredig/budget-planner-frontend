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
            :rules="passwordRules"
            required
          ></v-text-field>

          <v-text-field
            label="Re-enter password"
            type="password"
            v-model="matchingPassword"
            :rules="[passwordConfirmationRule]"
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
            color="success"
            class="mr-4"
            :disabled="!formValidity"
            >Submit</v-btn
          >
          <v-btn color="error" class="mr-4" @click="resetForm">Reset</v-btn>
          <v-btn color="primary" class="mr-4" to="/login">Back</v-btn>
        </v-form>
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
      value =>
        (value && value.indexOf('@') !== 0) || 'Email should have a username.',
      value =>
        (value && value.includes('@')) || 'Email should include an @ symbol.',
      value =>
        (value && value.indexOf('.') - value.indexOf('@') > 1) ||
        'Email should contain a valid domain.',
      value =>
        (value && value.includes('.')) ||
        'Email should include a period symbol.',
      value =>
        (value && value.indexOf('.') <= value.length - 3) ||
        'Email should contain a valid domain extension.'
    ],
    formValidity: false,

    passwordRules: [
      value => {
        // eslint-disable-next-line no-useless-escape
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        return (
          pattern.test(value) ||
          'Password must contain: At least 8 characters with a capital letter, a number, and a special character.'
        )
      }
    ]
  }),

  computed: {
    passwordConfirmationRule() {
      return (
        this.password === this.matchingPassword || 'Passwords does not match.'
      )
    }
  },

  methods: {
    resetForm() {
      this.$refs.signUpForm.reset()
    },
    register() {
      axios
        .post('/api/users/register', {
          email: this.email,
          name: this.name,
          password: this.password
        })
        .then(response => {
          this.message = response.data.email
          alert('User ' + this.message + ' was successfully registered!')
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
