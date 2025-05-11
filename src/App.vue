<template>
  <div id="app">
    <router-view/>
    <CommonFooter :loginAccount="loginAccount" :authenticated="authenticated" />
  </div>
</template>

<script>
import CommonFooter from './components/CommonFooter.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    CommonFooter
  },
  data() {
    return {
      loginAccount: null,
      authenticated: false
    }
  },
  created() {
    // 获取用户信息
    axios.get('http://localhost:9090/api/v1/accounts/profile', { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          this.loginAccount = res.data.data
          this.authenticated = true
        } else {
          this.authenticated = false
        }
      })
      .catch(() => {
        this.authenticated = false
      })
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>