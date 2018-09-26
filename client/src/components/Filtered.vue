<template>
  <div class="my-5">
    <button type="button" class="btn btn-success mb-3" v-if="token" data-toggle="modal" data-target="#addArticleModal">Ask Something</button>
    <h1>Forum</h1>
    <div class="row">
        <div class="card" style="width: 18rem;" v-for="(question, index) in questions" :key="index">
            <div class="card-body">
                <h5 class="card-title">{{question.title}}</h5>
                <h6 class="card-subtitle mb-2 text-muted">by {{question.user.name}}</h6>
                <p class="card-text">{{question.description}}</p>
                <router-link class="sidebar-title" :to="{ name: 'threads', params: {id: question._id} }">GO TO QUESTION</router-link>
                <br>
                <i class="far fa-thumbs-up"></i> {{ question.upVote.length }}
                &nbsp;<i class="far fa-thumbs-down"></i> {{ question.downVote.length }}
                <div class="float-right">
                        <button type="button" class="btn btn-sm btn-danger" v-if="question.isHim" @click="deleteQuestion(question._id)">Delete</button>&nbsp;
                        <button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#editArticleModal" v-if="question.isHim" @click="getQuestion(question._id)">Edit</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal Add Article -->
    <div class="modal fade" id="addArticleModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Ask Question</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">

            <div class="container">
              <form>
                <div class="form-group">
                  <label for="title">Title:</label>
                  <input type="text" class="form-control" v-model="title" required>
                </div>
                <div class="form-group">
                  <label for="content">Description:</label>
                  <textarea rows="8" cols="80" v-model="description" class="form-control"></textarea>
                </div>
              </form>

            </div>

          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="addQuestion">Ask</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal Edit Question -->
    <div class="modal fade" id="editArticleModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Edit Question</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body" v-if="isLoadEdit">

            <div class="container">
              <form>
                <div class="form-group">
                  <label for="title">Title:</label>
                  <input type="text" class="form-control" v-model="titleEdit" required>
                </div>
                <div class="form-group">
                  <label for="content">Description:</label>
                  <textarea rows="8" cols="80" v-model="descriptionEdit" class="form-control"></textarea>
                </div>
              </form>

            </div>

          </div>
          <div class="loader" v-if="!isLoadEdit"></div>
          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="updateQuestion">Edit Article</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal" @click="isLoadEdit = false">Close</button>
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
  props: ['id'],
  name: 'sidebar',
  data () {
    return {
      title: '',
      description: '',
      titleEdit: '',
      descriptionEdit: '',
      questionId: '',
      isLoad: false,
      isLoadEdit: false,
      coba: this.user
    }
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    questions () {
      return this.$store.state.questions
    },
    user () {
      console.log('computeds')
      return this.$store.state.user
    }
  },
  created () {
  
    let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''
    this.$store.dispatch('checkToken', token)
    this.$store.dispatch('setToken', token)
  },
  watch: {
    token () {
      let self = this
      let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''

      this.$store.dispatch('checkToken', token)

      axios({
        method: 'get',
        url: `${baseUrl}/question`
      })
        .then(response => {
          self.getAllQuestion()
        })
        .catch(err => {
          console.log(err)
        })
    },
    user(newValue) {
        this.getAllQuestion()
    }
  },
  methods: {
    getAllQuestion () {
      console.log(this.user, 'asdasd')
      let self = this
      
      axios({
        method: 'get',
        url:`${baseUrl}/question`
      })
        .then(response => {
          
          response.data.forEach(question => { 

            console.log("ini---->"+self.user.id)
            console.log("stringnya->"+question.user._id)
            if (String(question.user._id)==String(self.user.id)) {

              question['isHim'] = true
            } else {
              question['isHim'] = false
            }
          })
        
          self.$store.dispatch('setQuestion', response.data)
          self.isLoad = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteQuestion (id) {
      let self = this
      axios({
        method: 'delete',
        url: `${baseUrl}/question/${id}`,
        headers: {
          token: this.token
        }
      })
        .then(() => {
          self.getAllQuestion()
        })
        .catch(err => {
          console.log(err)
        })
    },
    addQuestion () {
      let self = this

      axios({
        method: 'post',
        url: `${baseUrl}/question`,
        headers: {
          token: this.token
        },
        data: {
          title: this.title,
          description: this.description
        }
      })
        .then(response => {
          self.getAllQuestion()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getQuestion (id) {
      let self = this

      axios({
        method: 'get',
        url: `${baseUrl}/question/${id}`
      })
        .then(response => {
          self.titleEdit = response.data.title
          self.descriptionEdit = response.data.description
          self.questionId = response.data._id
          self.isLoadEdit = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateQuestion () {
      let self = this

      this.isLoadEdit = false

      axios({
        method: 'put',
        url: `${baseUrl}/question/${this.questionId}`,
        headers: {
          token: this.token
        },
        data: {
          title: this.titleEdit,
          description: this.descriptionEdit
        }
      })
        .then(() => {
          self.$store.dispatch('setEditStat')
          self.$router.push({ path: `/${self.questionId}` })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
  .sidebar-title {
    font-size: 1.5rem;
    color:green
  }

  .card{
      padding:20px;
      margin:10px
  }
  .loader {
      border: 16px solid #f3f3f3; /* Light grey */
      border-top: 16px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 120px;
      height: 120px;
      animation: spin 2s linear infinite;
      margin: 0 auto;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
</style>
