<template>
  <div>
    <h1>Room Test</h1>
    <UButton @click="createOrJoinRoom">Create or Join</UButton>
  </div>
</template>

<script lang="ts" setup>
const {onConnect, createOrJoinRoom} = useWebsocket();

onConnect(() => {
  console.log('Connected to websocket');
})
</script>
