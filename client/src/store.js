import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const baseUrl = 'http://localhost:3000'

export default new Vuex.Store({
  state: {
    token: '',
    questions: [],
    user: {},
    editStat: false
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    removeToken (state) {
      state.token = ''
    },
    setQuestion (state, question) {
      state.questions = question
    },
    setData (state, data) {
      state.user = data
      console.log(state.user)
    },
    removeUser (state) {
      state.user = ''
    },
    setEditStat (state) {
      state.editStat = true
    },
    removeEditStat (state) {
      state.editStat = false
    }
  },
  actions: {
    setToken (context, token) {
      context.commit('setToken', token)
    },
    removeToken (context) {
      context.commit('removeToken')
    },
    setQuestion (context, question) {
      context.commit('setQuestion', question)
    },
    checkToken (context, token) {
      axios({
        method: 'get',
        url: `${baseUrl}/users/auth`,
        headers: {
          token: token
        }
      })
        .then(response => {
          console.log('iniiiiiiiiiii',response.data)
          context.commit('setData', response.data)
        })
        .catch(err => {
          console.log(err.response.data.error)
        })
    },
    removeUser (context) {
      context.commit('removeUser')
    },
    setEditStat (context) {
      context.commit('setEditStat')
    },
    removeEditStat (context) {
      context.commit('removeEditStat')
    },
    getQuestion (context) {
      let self = this

      axios({
        method: 'get',
        url: `${baseUrl}/question`
      })
        .then(response => {
          response.data.forEach(question => {
            if (question.user._id === self.state.user.id) {
              question['isHim'] = true
            } else {
              question['isHim'] = false
            }
          })

          self.commit('setQuestion', response.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})
