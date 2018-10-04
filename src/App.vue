<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h3>
      <router-link :to="{name: 'Home'}">首页</router-link>
      <router-link :to="{name: 'Contacts'}">通讯录</router-link>
    </h3>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
