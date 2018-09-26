<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div class="container flex-grow-1">
                <a class="navbar-brand" href="http://localhost:8080">Hacktiv Overflow</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">

                    <li class="nav-item">
                    <a class="nav-link" id="logout" v-on:click="logout" v-if="token">Logout</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="modal" data-target="#loginModal" v-if="!token">Login</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-toggle="modal" data-target="#registerModal" v-if="!token">Register</a>
                    </li>

                    </ul>
                </div>

            </div>
        </nav>

        <!-- Modal Login -->
        <div class="modal fade" id="loginModal">
            <div class="modal-dialog">
                <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title"><i class="fas fa-user"></i> Login</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <!-- Modal body -->
                <div class="modal-body">

                    <div class="container">
                    <form>
                        <div class="form-group">
                        <label for="email">Email address:</label>
                        <input type="email" class="form-control" v-model="emailLogin" required>
                        </div>
                        <div class="form-group">
                        <label for="pwd">Password:</label>
                        <input type="password" class="form-control" v-model="passwordLogin" required>
                        </div>
                        <hr class="light my-4">
                        <label>Or login with:</label><br>
                        <fb-signin-button
                            :params="fbSignInParams"
                            @success="onSignInSuccess"
                            @error="onSignInError" data-dismiss="modal">
                            Sign in with Facebook
                        </fb-signin-button>
                    </form>

                    </div>

                </div>

                <!-- Modal footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="login">Login</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                </div>

                </div>
            </div>
        </div>

        <!-- Modal Register -->
        <div class="modal fade" id="registerModal">
            <div class="modal-dialog">
                <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title"><i class="fas fa-user"></i> Register</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <!-- Modal body -->
                <div class="modal-body">

                    <div class="container">
                    <form>
                        <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="name" class="form-control" v-model="registerData.name" required autocomplete="off">
                        </div>
                        <div class="form-group">
                        <label for="email">Email address:</label>
                        <input type="email" class="form-control" v-model="registerData.email" required>
                        </div>
                        <div class="form-group">
                        <label for="pwd">Password:</label>
                        <input type="password" class="form-control" v-model="registerData.password" @keyup.enter="register" required>
                        </div>

                    </form>
                    </div>

                    <!-- Modal footer -->
                    <div class="modal-footer">
                    <button type="button" class="btn btn-primary" v-on:click="register" data-dismiss="modal">Register</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    </div>

                </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

const baseUrl = 'http://localhost:3000'

export default {
  data () {
    return {
      registerData: {
        name: '',
        email: '',
        password: ''
      },
      emailLogin: '',
      passwordLogin: '',
      fbSignInParams: {
        scope: 'email,user_likes',
        return_scopes: true
      }
    }
  },
  methods: {
    onSignInSuccess (response) {
      let self = this

      axios({
        method: 'post',
        url: `${baseUrl}/users/login-fb`,
        data: {
          token_fb: response.authResponse.accessToken
        }
      })
        .then(response => {
          localStorage.setItem('token', response.data)
          let token = localStorage.getItem('token')

          self.$store.dispatch('checkToken', token)
          self.$store.dispatch('setToken', response.data)
          self.$router.push({ path: '/' })
        })
        .catch(err => {
          console.log(err)
        })
    },
    onSignInError (error) {
      console.log('OH NOES', error)
    },
    login () {
      let self = this

      axios({
        method: 'post',
        url: `${baseUrl}/users/login`,
        data: {
          email: this.emailLogin || this.registerData.email,
          password: this.passwordLogin || this.registerData.password
        }
      })
        .then(response => {
          localStorage.setItem('token', response.data)

          let token = localStorage.getItem('token')

          self.$store.dispatch('checkToken', token)
          self.$store.dispatch('setToken', response.data)
          self.$router.push({ path: '/' })
        })
        .catch(err => {
          console.log(err)
        })
    },
    register () {
      let self = this

      axios({
        method: 'post',
        url: `${baseUrl}/users/register`,
        data: {
          name: this.registerData.name,
          email: this.registerData.email,
          password: this.registerData.password
        }
      })
        .then(() => {
          self.login()
          alert('Register success! You will automatically log in!')
        })
        .catch(err => {
          console.log(err)
        })
    },
    logout () {
      let self = this

      axios({
        method: 'get',
        url: `${baseUrl}/question`
      })
        .then(response => {
          self.$store.dispatch('setQuestion',response.data)
        })
        .catch(err => {
          console.log(err)
        })

      this.emailLogin = ''
      this.passwordLogin = ''
      this.registerData.name = ''
      this.registerData.email = ''
      this.registerData.password = ''

      localStorage.removeItem('token')
      this.$store.dispatch('removeToken')
      this.$store.dispatch('removeUser')
      this.$router.push({ path: '/' })
    }
  },
  computed: {
    token () {
      return this.$store.state.token
    }
  },
  created () {
    let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''

    this.$store.dispatch('setToken', token)
  }

}
</script>

<style scoped>
.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
}
</style>
