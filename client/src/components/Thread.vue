<template>
    <div class="container bootstrap snippet"> -->    
      <br><br><br>
        <h3 class="text-success strong">{{article.title}}</h3>
      	<ul class="comments">
          <li class="clearfix">
            <img src="https://bootdey.com/img/Content/user_1.jpg" class="avatar" alt="">
            <div class="post-comments">
                <p class="meta">{{created}} <a href="#">{{article.user.name}}</a> says : </p>
                <p>
                    {{article.description}}
                </p>
                &nbsp; <button class="btn btn-sm btn-ligth" v-if="token && !hisQuestion" @click="upVote(article._id)"><i class="far fa-thumbs-up"></i></button> <i class="far fa-thumbs-up" v-else></i> ({{ article.upVote.length }})
                &nbsp; <button class="btn btn-sm btn-ligth" v-if="token && !hisQuestion" @click="downVote(article._id)"><i class="far fa-thumbs-down"></i></button> <i class="far fa-thumbs-down" v-else></i> ({{ article.downVote.length }})
            </div>
				</li>
				</ul>
    <div class="row">
		<div class="col-md-12">
		    <div class="blog-comment">
				<h5 class="text-success">Comments</h5>
        <div v-for="answer in article.answer" v-bind:key="answer._id">
          <ul class="comments">
            <li class="clearfix">
              <img src="https://bootdey.com/img/Content/user_1.jpg" class="avatar" alt="">
              <div class="post-comments">
                  <p class="meta">{{answer.created}} <a href="#">{{answer.user.name}}</a> says</p> 
                  <p>
                      {{answer.content}}
                  </p>
                  <button type="button" class="btn btn-xs btn-ligth" data-toggle="modal" data-target="#editAnswerModal" v-if="token && answer.isHim" @click="setAnswerData(answer)"><i class="fas fa-pencil-alt"></i></button>&nbsp;
                  <button class="btn btn-sm btn-ligth" v-if="token && !answer.isHim" @click="upVoteAnswer(answer._id)"><i class="far fa-thumbs-up"></i></button> <i class="far fa-thumbs-up" v-else></i> ({{ answer.upVote.length }})&nbsp;
                  <button class="btn btn-sm btn-ligth" v-if="token && !answer.isHim" @click="downVoteAnswer(answer._id)"><i class="far fa-thumbs-down"></i></button> <i class="far fa-thumbs-down" v-else></i> ({{ answer.downVote.length }})
              </div>
          </li>
          </ul>
        </div>  

         <div class="my-3" v-if="token && isLoad">
            <div class="form-group row">
              <div class="col-lg">
                <textarea class="form-control" rows="3" placeholder="Answer........." v-model="answer"></textarea>
                <br>
                <button type="button" class="btn btn-success" @click="postAnswer(article._id)">Answer</button>
              </div>
            </div>
         </div>

      <div class="modal fade" id="editAnswerModal">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
    
            <div class="modal-header">
              <h4 class="modal-title">Edit Answer</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
          
            <div class="modal-body">

              <div class="container">
                <form>
                  <div class="form-group">
                    <label for="title">Answer:</label>
                    <div class="col-lg">
                      <textarea class="form-control" rows="3" v-model="answerEditContent"></textarea>
                    </div>
                  </div>
                </form>

              </div>

            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="updateAnswer">Edit Answer</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal" @click="isLoadEdit = false">Close</button>
            </div>
          </div>
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
  props: ['id'],
  data () {
    return {
      article: {},
      created: '',
      isLoad: false,
      answer: '',
      hisQuestion: false,
      answerEditContent: '',
      answerId: ''
    }
  },
  created () {
    this.getArticle()
  },
  watch: {
    id: function () {
      this.getArticle()
    },
    editStat () {
      this.getArticle()
    }
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    editStat () {
      return this.$store.state.editStat
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    getArticle () {
      let self = this

      axios({
        method: 'get',
        url: `${baseUrl}/question/${this.id}`
      })
        .then(response => {
          self.$store.dispatch('getQuestion')

          if (response.data.user._id === self.user.id) {
            self.hisQuestion = true
          } else {
            self.hisQuestion = false
          }

          response.data.answer.forEach(data => {
            if (data.user._id === self.user.id) {
              data['isHim'] = true
            } else {
              data['isHim'] = false
            }
          })

          self.article = response.data
          self.created = new Date(response.data.createdAt).toLocaleDateString()
          self.isLoad = true

          self.$store.dispatch('removeEditStat')
        })
        .catch(err => {
          console.log(err)
        })
    },
    upVote (id) {
      let self = this

      axios({
        method: 'patch',
        url: `${baseUrl}/question/upvote/${id}`,
        headers: {
          token: this.token
        }
      })
        .then(() => {
          self.getArticle()
        })
        .catch(err => {
          console.log(err)
        })
    },
    downVote (id) {
      let self = this

      axios({
        method: 'patch',
        url: `${baseUrl}/question/downvote/${id}`,
        headers: {
          token: this.token
        }
      })
        .then(() => {
          self.getArticle()
        })
        .catch(err => {
          console.log(err)
        })
    },
    postAnswer (id) {
      let self = this

      axios({
        method: 'post',
        url: `${baseUrl}/answer/${id}`,
        headers: {
          token: this.token
        },
        data: {
          content: this.answer
        }
      })
        .then(() => {
          self.getArticle()
          self.$store.dispatch('getQuestion')
          self.answer = ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    setAnswerData (data) {
      this.answerEditContent = data.content
      this.answerId = data._id
    },
    updateAnswer () {
      let self = this

      axios({
        method: 'put',
        url: `${baseUrl}/answer/${this.answerId}`,
        headers: {
          token: this.token
        },
        data: {
          content: this.answerEditContent
        }
      })
        .then(() => {
          self.getArticle()
          self.$store.dispatch('getQuestion')
        })
        .catch(err => {
          console.log(err)
        })
    },
    upVoteAnswer (id) {
      let self = this

      axios({
        method: 'patch',
        url: `${baseUrl}/answer/upvote/${id}`,
        headers: {
          token: this.token
        }
      })
        .then(() => {
          self.getArticle()
          self.$store.dispatch('getQuestion')
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    downVoteAnswer (id) {
      let self = this

      axios({
        method: 'patch',
        url: `${baseUrl}/answer/downvote/${id}`,
        headers: {
          token: this.token
        }
      })
        .then(() => {
          self.getArticle()
          self.$store.dispatch('getQuestion')
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }
}
</script>

<style>
.blog-comment::before,
.blog-comment::after,
.blog-comment-form::before,
.blog-comment-form::after{
    content: "";
	display: table;
	clear: both;
}

.blog-comment{
    padding-left: 15%;
	padding-right: 15%;
}

.blog-comment ul{
	list-style-type: none;
	padding: 0;
}

.blog-comment img{
	opacity: 1;
	filter: Alpha(opacity=100);
	-webkit-border-radius: 4px;
	   -moz-border-radius: 4px;
	  	 -o-border-radius: 4px;
			border-radius: 4px;
}

.blog-comment img.avatar {
	position: relative;
	float: left;
	margin-left: 0;
	margin-top: 0;
	width: 65px;
	height: 65px;
}

.blog-comment .post-comments{
	border: 1px solid #eee;
    margin-bottom: 20px;
    margin-left: 85px;
	margin-right: 0px;
    padding: 10px 20px;
    position: relative;
    -webkit-border-radius: 4px;
       -moz-border-radius: 4px;
       	 -o-border-radius: 4px;
    		border-radius: 4px;
	background: #fff;
	color: #6b6e80;
	position: relative;
}

.blog-comment .meta {
	font-size: 13px;
	color: #aaaaaa;
	padding-bottom: 8px;
	margin-bottom: 10px !important;
	border-bottom: 1px solid #eee;
}

.blog-comment ul.comments ul{
	list-style-type: none;
	padding: 0;
	margin-left: 85px;
}

.blog-comment-form{
	padding-left: 15%;
	padding-right: 15%;
	padding-top: 40px;
}

.blog-comment h3,
.blog-comment-form h3{
	margin-bottom: 40px;
	font-size: 26px;
	line-height: 30px;
	font-weight: 800;
}
</style>
