<template>
  <div class="my-5"> 

      <h3>Forum Filter</h3>
      <div class="list-group">

        <div class="list-group-item">
          <router-link to="/filtered/1"><button type="button" class="btn btn-block-success">All Articles</button></router-link>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  computed: {
    token () {
      return this.$store.state.token
    },
    user(){
      return this.$store.state.user
    }
  },
  created () {
    let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''

    this.$store.dispatch('setToken', token)
  }
}
</script>
<style scoped>
  .sidebar-title {
    font-size: 1.5rem;
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
