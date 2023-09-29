<template>
  <a-button @click="handleClick">哈哈哈</a-button>
  <img src="./img.png" alt="">
</template>

<script setup lang="ts">
  const handleClick = () => {
    // return new Promise((resolve) => {resolve(1)})
    console.log('哈哈')
  }
</script>

<style scoped>
</style>
