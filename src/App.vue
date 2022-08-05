<script setup lang="ts">
import routes from '@/router/routes'
</script>
<template>
  <div class="example">
    <router-link class="link" v-for="(l, i) in routes" :key="i" :to="l.path">
      {{ l.name }}
    </router-link>
  </div>

  <router-view></router-view>
</template>

<style scoped>
.example {
  position: fixed;
  top: 0;
  z-index: 999;
  display: flex;
  flex-wrap: wrap;
}
.link {
  margin: 4px;
}
</style>
