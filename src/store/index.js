import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('user')
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${userData.token}`
    },
    CLEAR_USER_DATA() {
      localStorage.removeItem('user')
      location.reload()
    }
  },
  actions: {
    login({ commit }, credentials) {
      return axios.post('/api/authenticate', credentials).then(({ data }) => {
        commit('SET_USER_DATA', data)
      })
    },
    register({ commit }, credentials) {
      return axios
        .post('//localhost:8081/users/register', credentials)
        .then(({ data }) => {
          commit('SET_USER_DATA', data)
        })
    },

    logout({ commit }) {
      commit('CLEAR_USER_DATA')
    }
  },
  getters: {
    loggedIn(state) {
      return !!state.user
    }
  }
})
