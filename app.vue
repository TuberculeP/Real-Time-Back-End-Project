<template>
  <ClientOnly >

    <RoomTest />

  </ClientOnly>
</template>

<script setup lang="ts">
import RoomTest from './components/RoomTest.vue';

const {onConnect} = useWebsocket();

onConnect(() => {
  console.log('Connected to websocket 2');
})
</script>
